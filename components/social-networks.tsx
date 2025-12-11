"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SocialIcon } from "react-social-icons/component";

export default function SocialNetworksPill({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const [presetIndex, setPresetIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? systemTheme : theme;
  const fgColor = activeTheme === "dark" ? "white" : "black";

  const icons = useMemo(
    () => [
      {
        network: "github",
        href: "https://github.com/g30r93g",
      },
      {
        network: "linkedin",
        href: "https://www.linkedin.com/in/g30r93g",
      },
    ],
    [],
  );

  const setIndicatorPosition = (index: number, visible: boolean) => {
    const target = iconRefs.current[index];
    const container = containerRef.current;
    if (!target || !container) {
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const offset = 3;
    const left = targetRect.left - containerRect.left - offset;
    const top = targetRect.top - containerRect.top - offset;

    setIndicator({
      left,
      top,
      width: targetRect.width,
      height: targetRect.height,
      visible,
    });
  };

  const updateIndicator = (index: number) => {
    setIndicatorPosition(index, true);
  };

  const presetIndicator = (index: number) => {
    setIndicatorPosition(index, false);
    setPresetIndex(index);
  };

  const hideIndicator = () => {
    setIndicator((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const margin = 40;
      const expandedRect = {
        left: rect.left - margin,
        right: rect.right + margin,
        top: rect.top - margin,
        bottom: rect.bottom + margin,
      };

      const { clientX, clientY } = event;
      const insideContainer =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
      const nearContainer =
        clientX >= expandedRect.left &&
        clientX <= expandedRect.right &&
        clientY >= expandedRect.top &&
        clientY <= expandedRect.bottom;

      if (!insideContainer && nearContainer) {
        let closestIndex: number | null = null;
        let smallestDistance = Number.POSITIVE_INFINITY;
        iconRefs.current.forEach((icon, idx) => {
          if (!icon) {
            return;
          }

          const iconRect = icon.getBoundingClientRect();
          const iconCenter = iconRect.left + iconRect.width / 2;
          const distance = Math.abs(iconCenter - clientX);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = idx;
          }
        });

        if (
          closestIndex !== null &&
          closestIndex !== presetIndex &&
          closestIndex < icons.length
        ) {
          presetIndicator(closestIndex);
        }
      } else if (!nearContainer) {
        setPresetIndex(null);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [icons.length, presetIndex]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-row gap-2 h-fit w-fit bg-accent/50 dark:bg-accent/35 rounded-full border p-0.5",
        className,
      )}
      onMouseLeave={hideIndicator}
      {...props}
    >
      <span
        className={cn(
          "absolute rounded-full bg-primary/15 border border-primary/40 transition-all duration-200 ease-out pointer-events-none",
        )}
        style={{
          width: indicator.width,
          height: indicator.height,
          transform: `translate(${indicator.left}px, ${indicator.top}px)`,
          opacity: indicator.visible ? 1 : 0,
        }}
      />
      {icons.map((icon, index) => (
        <div
          key={icon.network}
          ref={(el) => {
            iconRefs.current[index] = el;
          }}
          className="rounded-full"
          onMouseEnter={() => updateIndicator(index)}
          onFocus={() => updateIndicator(index)}
        >
          <SocialIcon
            fgColor={fgColor}
            className={
              "rounded-full"
              // "border border-transparent transition hover:bg-accent hover:border-primary focus-visible:bg-accent focus-visible:border-primary"
            }
            network={icon.network as "github" | "linkedin"}
            href={icon.href}
            bgColor={"transparent"}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
          />
        </div>
      ))}
    </div>
  );
}
