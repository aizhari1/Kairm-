"use client";
import { useEffect, useRef } from "react";

const FPS = 24, TOTAL = 180; // timecode runs 3 minutes across the page
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (s: number) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(Math.floor(s % 60))}:${pad(Math.floor((s % 1) * FPS))}`;
const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);

/** Editor-style timeline pinned to the bottom: the playhead follows scroll, and dragging it scrubs the page. */
export function TimelineDock() {
  const head = useRef<HTMLSpanElement>(null);
  const code = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const p = Math.min(1, scrollY / maxScroll());
      if (head.current) head.current.style.left = `${p * 100}%`;
      if (code.current) code.current.textContent = fmt(p * TOTAL);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => { removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  const seek = (e: React.PointerEvent) => {
    const r = bar.current!.getBoundingClientRect();
    scrollTo(0, Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * maxScroll());
  };

  return (
    <div aria-hidden className="fixed inset-x-0 bottom-0 z-30 flex h-12 items-center gap-4 border-t border-brand/30 bg-bg/90 px-4 pe-20 backdrop-blur">
      <span ref={code} className="digital w-[11ch] text-brand">00:00:00:00</span>
      <div ref={bar} className="dock-bar relative h-7 flex-1 cursor-ew-resize touch-none"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seek(e); }}
        onPointerMove={(e) => { if (e.buttons === 1) seek(e); }}>
        <span ref={head} className="dock-head absolute inset-y-0 w-0.5 bg-brand-light" />
      </div>
    </div>
  );
}
