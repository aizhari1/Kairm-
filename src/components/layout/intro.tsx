"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Film-leader countdown (3, 2, 1) that ends with a flash and a clap. Plays once per session. */
export function Intro() {
  const [n, setN] = useState(3);
  const [tc, setTc] = useState("00:00:00:00");
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(false);

  const end = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setOut(true);
    window.dispatchEvent(new Event("karam:clap"));
    setTimeout(() => setGone(true), 450);
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("karam-intro"); } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { setGone(true); return; }
    try { sessionStorage.setItem("karam-intro", "1"); } catch {}
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const s = (performance.now() - t0) / 1000;
      setTc(`00:00:${pad(Math.floor(s))}:${pad(Math.floor((s % 1) * 24))}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const iv = setInterval(() => setN((x) => x - 1), 800);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, []);

  useEffect(() => { if (n <= 0) end(); }, [n, end]);

  if (gone) return null;
  return (
    <>
      <div id="intro" aria-hidden className={`fixed inset-0 z-[100] grid place-content-center justify-items-center gap-6 bg-bg transition-opacity duration-300 ${out ? "pointer-events-none opacity-0" : ""}`}>
        <div className="leader"><span className="font-neon neon-glow relative z-10 text-[min(30vw,9rem)] leading-none">{Math.max(n, 1)}</span></div>
        <p className="digital text-xl text-brand">{tc}</p>
        <button type="button" onClick={end} className="min-h-11 rounded border border-white/30 px-4 text-sm text-muted hover:text-white">Skip</button>
      </div>
      {out && <div className="intro-flash" aria-hidden />}
    </>
  );
}
