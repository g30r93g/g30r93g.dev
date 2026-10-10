"use client";

import { useSyncExternalStore } from "react";
import { consent } from "@/lib/storage-consent";

// the server can't know the choice, so it renders no notice
const useConsent = () => useSyncExternalStore(consent.subscribe, consent.get, () => null);

/** Says what the site keeps in this browser, until the visitor answers. */
export default function StorageNotice() {
  if (useConsent() !== "") return null;
  return (
    <aside className={"storage-notice"} aria-label={"Saved data"}>
      <p>
        No cookies here. This browser keeps your theme and your Ship it progress, and none of it is sent anywhere.
      </p>
      <div className={"storage-notice-actions"}>
        <button className={"game-btn"} onClick={() => consent.set("no")}>
          Don&apos;t save
        </button>
        <button className={"game-btn"} onClick={() => consent.set("yes")}>
          OK
        </button>
      </div>
    </aside>
  );
}

/** For the footer: brings the notice back to change the answer. */
export function StorageLink() {
  const choice = useConsent();
  if (!choice) return null;
  return (
    <button className={"label storage-link"} onClick={() => consent.set("")}>
      Saved data: {choice === "yes" ? "on" : "off"}
    </button>
  );
}
