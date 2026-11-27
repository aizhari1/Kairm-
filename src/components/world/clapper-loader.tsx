"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ClapperCanvas = dynamic(() => import("./clapper"), { ssr: false });

/** Optional full-viewport clapper background (not wired by default; OrbLoader is used in layout). */
export function ClapperLoader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if ((nav.hardwareConcurrency ?? 8) <= 2 || nav.connection?.saveData) return;
    const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 400));
    const id = ric(() => setOn(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
    };
  }, []);

  return (
    <>
      <div id="orb-fallback" aria-hidden className="clapper-fallback" />
      <div id="clapper-bg" aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-70">
        {on && <ClapperCanvas accent="#00F0FF" second="#FF2BD6" auto />}
      </div>
    </>
  );
}
