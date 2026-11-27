"use client";
import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Film-style timeline dock that tracks scroll position like a scrubber. */
export function TimelineDock() {
  const [pct, setPct] = useState(0);
  const [tc, setTc] = useState("00:00:00:00");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setPct(Math.min(1, Math.max(0, p)));
      const total = 90;
      const s = p * total;
      setTc(`00:${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}:${pad(Math.floor((s % 1) * 24))}`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden md:block" aria-hidden>
      <div className="mx-auto flex max-w-5xl items-end gap-3 px-6 pb-3">
        <span className="digital text-[10px] text-brand">{tc}</span>
        <div className="dock-bar relative h-2 flex-1 rounded-full bg-white/10">
          <div className="dock-head absolute top-1/2 size-3 -translate-y-1/2 rounded-sm bg-brand-light" style={{ left: `calc(${pct * 100}% - 6px)` }} />
        </div>
        <span className="digital text-[10px] text-muted">01:30:00:00</span>
      </div>
    </div>
  );
}
