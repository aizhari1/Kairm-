"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const ink = "#0b0b0b";
const slash = (x: number, y: number) => `M${x} ${y + 60}h40l48-60h-40z`;

/** The clapperboard from the brand reference, drawn as SVG so the stick can swing open and slam shut. */
function Clapper({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg ref={svgRef} viewBox="0 -270 640 826" className="h-auto w-[min(84vw,520px)]" role="img" aria-label="Clapperboard">
      <rect x="8" y="207" width="624" height="349" fill={ink} />
      <path d="M35 276H611M35 364H611M35 450H611M205 450V538M441 450V538" stroke="#fff" strokeWidth="3" />
      <rect x="8" y="140" width="628" height="67" fill={ink} />
      {[78, 232, 385, 545].map((x) => <path key={x} d={slash(x, 145)} fill="#fff" />)}
      <clipPath id="stick-clip"><rect x="8" y="78" width="628" height="62" /></clipPath>
      <g>
        <animateTransform attributeName="transform" type="rotate" dur="2.2s" begin="0s" fill="freeze" calcMode="spline"
          values="-7 40 108; -26 40 108; -26 40 108; 0 40 108; 0 40 108" keyTimes="0; 0.35; 0.6; 0.72; 1"
          keySplines=".2 .8 .3 1; 0 0 1 1; .7 0 1 1; 0 0 1 1" />
        <rect x="8" y="78" width="628" height="62" rx="4" fill={ink} />
        <g clipPath="url(#stick-clip)">{[98, 252, 406, 560].map((x) => <path key={x} d={slash(x, 79)} fill="#fff" />)}</g>
        <circle cx="40" cy="108" r="16" fill="#fff" stroke={ink} strokeWidth="5" />
      </g>
    </svg>
  );
}

/** Opening card: the clapperboard swings open, slams shut, then we cut to the site. Plays once per session. */
export function Intro() {
  const svg = useRef<SVGSVGElement>(null);
  const [tc, setTc] = useState("00:00:00:00");
  const [slam, setSlam] = useState(false);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(false);

  const end = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setOut(true);
    window.dispatchEvent(new Event("karam:clap"));
    setTimeout(() => setGone(true), 200);
  }, []);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("karam-intro"); } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { setGone(true); return; }
    try { sessionStorage.setItem("karam-intro", "1"); } catch {}
    svg.current?.setCurrentTime(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const s = (performance.now() - t0) / 1000;
      setTc(`00:00:${pad(Math.floor(s))}:${pad(Math.floor((s % 1) * 24))}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setSlam(true), 1580);
    const t2 = setTimeout(end, 2300);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [end]);

  if (gone) return null;
  return (
    <div id="intro" className={`fixed inset-0 z-[100] grid place-content-center justify-items-center gap-5 bg-white text-black transition-opacity duration-150 ${out ? "pointer-events-none opacity-0" : ""}`}>
      <div className={slam ? "slam-shake" : ""}><Clapper svgRef={svg} /></div>
      <p className="digital text-lg">SCENE 01 · TAKE 01 · {tc}</p>
      <button type="button" onClick={end} className="min-h-11 rounded border border-black/30 px-4 text-sm text-black/70 hover:text-black">Skip</button>
    </div>
  );
}
