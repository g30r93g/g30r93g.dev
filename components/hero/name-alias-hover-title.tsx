"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type NameAliasHoverTitleProps = {
  name: string;
  alias: string;
  className?: string;
  characterDelayMs?: number;
};

export default function NameAliasHoverTitle({
  name,
  alias,
  className,
  characterDelayMs = 100,
}: NameAliasHoverTitleProps) {
  const maxLength = useMemo(
    () => Math.max(name.length, alias.length),
    [alias, name],
  );

  const normalizedName = useMemo(
    () => name.padEnd(maxLength, " "),
    [maxLength, name],
  );
  const normalizedAlias = useMemo(
    () => alias.padEnd(maxLength, " "),
    [alias, maxLength],
  );

  const [displayChars, setDisplayChars] = useState<string[]>(() =>
    normalizedName.split(""),
  );
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [visibleLimit, setVisibleLimit] = useState(maxLength);

  useEffect(() => {
    setVisibleLimit(maxLength);
  }, [maxLength]);

  useEffect(() => {
    setDisplayChars(normalizedName.split(""));
  }, [normalizedName]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  const runAnimation = (targetString: string, nextTarget: "name" | "alias") => {
    if (nextTarget === "alias") {
      setVisibleLimit(alias.length);
    }

    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsRef.current = [];

    targetString.split("").forEach((char, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayChars((prev) => {
          if (prev[index] === char) {
            return prev;
          }

          const next = [...prev];
          next[index] = char;
          return next;
        });
        if (nextTarget === "name" && index >= alias.length) {
          setVisibleLimit((prev) => Math.max(prev, index + 1));
        }
      }, index * characterDelayMs);

      timeoutsRef.current.push(timeoutId);
    });
  };

  return (
    <h1
      className={cn("inline-flex whitespace-pre", className)}
      onMouseEnter={() => runAnimation(normalizedAlias, "alias")}
      onMouseLeave={() => runAnimation(normalizedName, "name")}
    >
      {displayChars.map((char, index) => (
        <span
          key={index}
          className={cn(
            "inline-block",
            index >= visibleLimit && "opacity-0",
          )}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
