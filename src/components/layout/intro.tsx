"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const ClapperCanvas = dynamic(() => import("@/components/world/clapper"), { ssr: false });

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Opening sequence: big 3D clapper sits open → digital countdown → sticks SLAM shut → flash → site.
 * Plays once per browser session.
 */
export function Intro() {
  const [phase, setPhase] = useState<"boot" | "count" | "clap" | "out" | "gone">("boot");
  const [n, setN] = useState(3);
  const [tc, setTc] = useState("00:00:00:00");
  const [clapKey, setClapKey] = useState(0);

  const finish = useCallback(() => {
    setPhase("out");
    window.dispatchEvent(new Event("karam:clap"));
    try {
      sessionStorage.setItem("karam-intro", "1");
    } catch {}
    setTimeout(() => setPhase("gone"), 520);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("karam-intro");
    } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      return;
    }

    setPhase("count");
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const s = (performance.now() - t0) / 1000;
      const frames = Math.floor((s % 1) * 24);
      setTc(`00:00:${pad(Math.floor(s))}:${pad(frames)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const iv = setInterval(() => {
      setN((x) => {
        if (x <= 1) {
          clearInterval(iv);
          return 0;
        }
        return x - 1;
      });
    }, 850);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    if (n !== 0 || phase !== "count") return;
    setPhase("clap");
    setClapKey((k) => k + 1);
    const t = setTimeout(finish, 700);
    return () => clearTimeout(t);
  }, [n, phase, finish]);

  if (phase === "gone") return null;

  return (
    <>
      <div
        id="intro"
        aria-hidden
        className={`fixed inset-0 z-[100] grid place-content-center justify-items-center gap-5 bg-[#05060d] transition-opacity duration-500 ${
          phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative h-[min(58vh,420px)] w-[min(92vw,520px)]">
          <ClapperCanvas accent="#00F0FF" second="#FF2BD6" clapKey={clapKey} scale={1.15} cameraZ={6.4} />
        </div>

        <p className="digital-xl tabular-nums tracking-[0.2em] text-[#00F0FF] drop-shadow-[0_0_12px_#00F0FF]">
          {tc}
        </p>
        {phase === "count" && n > 0 && (
          <p className="digital-xl text-[clamp(3rem,14vw,6rem)] leading-none text-white drop-shadow-[0_0_20px_#FF2BD6]">
            {n}
          </p>
        )}
        {phase === "clap" && (
          <p className="digital-xl animate-pulse text-2xl tracking-[0.35em] text-[#FF2BD6]">MARK</p>
        )}

        <button
          type="button"
          onClick={finish}
          className="digital min-h-11 rounded border border-white/25 px-4 text-sm tracking-widest text-muted hover:border-brand hover:text-white"
        >
          SKIP
        </button>
      </div>
      {phase === "out" && <div className="intro-flash" aria-hidden />}
    </>
  );
}
