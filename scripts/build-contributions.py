#!/usr/bin/env python3
"""Build content/github/contributions.json: per-day commits, split into personal and work.

Why not GitHub's contribution calendar: it reports all private activity as an anonymous
count, so a private personal repo (racedash) looks the same as a private work repo.
Instead this script counts your commits repo by repo and classifies each repo by owner.

What counts as a commit of yours:
  - commits on the default branch authored by you, and
  - your commits inside pull requests you opened (merged or open). This recovers work
    that a squash merge collapses into one commit. That squash commit (a merge commit
    with one parent) is then left out, so nothing is counted twice.
Commits are de-duplicated on a fingerprint (author date + start of the first message
line). Unlike the commit id, it survives "rebase and merge" and cherry-picks.

History survives losing access: every commit found goes into LEDGER, which only grows.
A later run that can no longer read a repo (access revoked) keeps that repo's entries.
The ledger holds no repo names, commit ids or messages: only a hash of each
fingerprint, its date and personal/work. It is safe to commit to a public repository.

Also records your public profile stats (repos, stars, followers), so the page never
depends on GitHub's unauthenticated API, which allows only 60 requests an hour per IP.
`--profile-only` refreshes just those, in seconds.

Needs an authenticated `gh` CLI. Run it regularly, and before you lose access to an org:
  python3 scripts/build-contributions.py [--profile-only]
"""
import hashlib, json, subprocess, sys
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ME = "g30r93g"
MY_EMAILS = {"georgegorzynski@me.com", "me@g30r93g.dev"}
OUT_DIR = Path(__file__).resolve().parent.parent / "content" / "github"
LEDGER = OUT_DIR / "contributions-ledger.json"
SNAPSHOT = OUT_DIR / "contributions.json"
WINDOW_DAYS = 371  # 53 weeks, the heatmap's width

# Repo owner -> "personal" or "work". Owners not listed: public repos count as personal
# (open source); private repos are skipped with a warning, so nothing is guessed.
OWNERS = {
    ME: "personal",
    "TwentyDimensions": "personal",
    "AranJannson": "personal",
    "Table-Side": "personal",          # assumed: Tableside is in content/projects
    "Data-Literacy-Academy": "work",
    "nicDLA": "work",                  # assumed: a DLA colleague's repo
    "TeamSurreyKarting": "work",
    "Team-Surtes": "work",
}

def gh(*args):
    out = subprocess.run(["gh", *args], capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError(out.stderr.strip() or "gh failed")
    return out.stdout

def rows(*args):
    return [l for l in gh(*args).splitlines() if l]

def mine(login, email):
    return login == ME or (email or "").lower() in MY_EMAILS

def fingerprint(author_date, first_line):
    # GraphQL truncates long headlines with "…", so compare on the first 60 characters
    return hashlib.sha256(f"{author_date}|{first_line.rstrip('…')[:60]}".encode()).hexdigest()[:20]

def classify(repo, private):
    owner = repo.split("/")[0]
    return OWNERS.get(owner) or (None if private else "personal")

# ---------------------------------------------------------------- pull requests (GraphQL)
PR_QUERY = """query($endCursor: String) { viewer { pullRequests(first: 50, after: $endCursor,
  orderBy: {field: CREATED_AT, direction: DESC}) { pageInfo { hasNextPage endCursor } nodes {
    number createdAt repository { nameWithOwner isPrivate }
    mergeCommit { oid parents { totalCount } }
    commits(first: 100) { totalCount nodes { commit { authoredDate messageHeadline author { email user { login } } } } }
} } } }"""

def my_prs(since_iso):
    """repo -> list of PRs you opened since `since_iso`, with your commits in each."""
    out = defaultdict(list)
    cursor = None
    while True:
        args = ["api", "graphql", "-f", f"query={PR_QUERY}"] + (["-f", f"endCursor={cursor}"] if cursor else [])
        page = json.loads(gh(*args))["data"]["viewer"]["pullRequests"]
        for pr in page["nodes"]:
            if pr["createdAt"] < since_iso:
                return out   # newest first, so everything after this is older
            repo = pr["repository"]["nameWithOwner"]
            commits = [c["commit"] for c in pr["commits"]["nodes"]]
            if pr["commits"]["totalCount"] > len(commits):   # rare: very long PRs, fetch the rest via REST
                commits = [{"authoredDate": r.split("\t")[0], "messageHeadline": r.split("\t")[3],
                            "author": {"email": r.split("\t")[2], "user": {"login": r.split("\t")[1]}}}
                           for r in rows("api", "--paginate", f"repos/{repo}/pulls/{pr['number']}/commits?per_page=100",
                                         "--jq", '.[] | "\\(.commit.author.date)\\t\\(.author.login // "")\\t\\(.commit.author.email)\\t\\(.commit.message | split("\\n")[0] | gsub("\\t"; " "))"')]
            mc = pr["mergeCommit"]
            out[repo].append({
                "private": pr["repository"]["isPrivate"],
                "squash": mc["oid"] if mc and mc["parents"]["totalCount"] == 1 else None,
                "commits": [(c["authoredDate"], c["messageHeadline"]) for c in commits
                            if mine(((c["author"] or {}).get("user") or {}).get("login"), (c["author"] or {}).get("email"))],
            })
        if not page["pageInfo"]["hasNextPage"]:
            return out
        cursor = page["pageInfo"]["endCursor"]

# ---------------------------------------------------------------- default branches (REST)
def repos_pushed(since_iso):
    repos = {}
    for row in rows("api", "--paginate", "user/repos?affiliation=owner,collaborator,organization_member&per_page=100&sort=pushed",
                    "--jq", f'.[] | select(.pushed_at > "{since_iso}") | "\\(.full_name)\\t\\(.private)"'):
        name, private = row.split("\t")
        repos[name] = private == "true"
    return repos

def default_branch_commits(repo, since_iso):
    """sha -> (author date, first line) for your commits on the default branch."""
    found = {}
    for who in [ME, *MY_EMAILS]:   # by login, and by email in case one isn't linked to the account
        for row in rows("api", "--paginate", f"repos/{repo}/commits?author={who}&since={since_iso}&per_page=100",
                        "--jq", '.[] | "\\(.sha)\\t\\(.commit.author.date)\\t\\(.commit.message | split("\\n")[0] | gsub("\\t"; " "))"'):
            sha, d, line = (row.split("\t") + ["", ""])[:3]
            found[sha] = (d, line)
    return found

# ---------------------------------------------------------------- profile
def profile():
    u = json.loads(gh("api", f"users/{ME}"))
    stars = sum(int(n) for n in rows("api", "--paginate", f"users/{ME}/repos?type=owner&per_page=100", "--jq", ".[].stargazers_count"))
    return {"repos": u["public_repos"], "stars": stars, "followers": u["followers"],
            "since": u["created_at"][:4], "avatar": u["avatar_url"]}

def write(data):
    SNAPSHOT.write_text(json.dumps(data) + "\n")

# ---------------------------------------------------------------- main
def main():
    if "--profile-only" in sys.argv:
        data = json.loads(SNAPSHOT.read_text())
        data["profile"] = profile()
        write(data)
        print(f"profile: {data['profile']}", file=sys.stderr)
        return

    today = date.today()
    since = today - timedelta(days=WINDOW_DAYS)
    since_iso = f"{since}T00:00:00Z"
    ledger = json.loads(LEDGER.read_text()) if LEDGER.exists() else {}
    before = len(ledger)

    prs = my_prs(since_iso)
    repos = repos_pushed(since_iso)
    for repo, lst in prs.items():          # repos you only reached through PRs (e.g. open source)
        repos.setdefault(repo, lst[0]["private"])

    summary = defaultdict(dict)
    for repo, private in sorted(repos.items()):
        kind = classify(repo, private)
        if kind is None:
            print(f"  skip  {repo} (private, owner '{repo.split('/')[0]}' not in OWNERS)", file=sys.stderr)
            continue
        try:
            default = default_branch_commits(repo, since_iso)
        except RuntimeError as e:   # revoked access, empty repo: keep what the ledger already has
            print(f"  skip  {repo} ({str(e).splitlines()[0][:70]})", file=sys.stderr)
            default = {}
        for pr in prs.get(repo, []):
            default.pop(pr["squash"], None)   # the PR's own commits stand in for its squash commit
        found = {fingerprint(d, line): d for d, line in default.values()}
        for pr in prs.get(repo, []):
            for d, line in pr["commits"]:
                if d >= since_iso:
                    found[fingerprint(d, line)] = d
        for fp, d in found.items():
            ledger[fp] = [d[:10], kind]
        if found:
            summary[kind][repo] = (len(found), len(prs.get(repo, [])))

    LEDGER.write_text(json.dumps(dict(sorted(ledger.items())), separators=(",", ":")))

    per_day = defaultdict(lambda: {"personal": 0, "work": 0})
    for d, kind in ledger.values():
        if d >= since.isoformat():
            per_day[d][kind] += 1
    dates = [(since + timedelta(days=i)).isoformat() for i in range(WINDOW_DAYS + 1)]
    data = {"generated": today.isoformat(), "unit": "commits", "profile": profile(),
            "days": [{"date": d, **per_day[d]} for d in dates]}
    write(data)

    for kind in ("personal", "work"):
        print(f"{kind}: {sum(per_day[d][kind] for d in dates)} commits in window", file=sys.stderr)
        for repo, (c, n) in sorted(summary[kind].items(), key=lambda x: -x[1][0])[:12]:
            print(f"  {c:5}  {repo}  ({n} PRs)", file=sys.stderr)
    print(f"ledger: {len(ledger)} commits ({len(ledger) - before:+} this run) -> {LEDGER.name}", file=sys.stderr)

if __name__ == "__main__":
    main()
