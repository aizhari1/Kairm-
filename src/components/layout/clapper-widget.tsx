"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLite } from "@/components/world/use-world";

const ClapperCanvas = dynamic(() => import("@/components/world/clapper"), { ssr: false });

/** Small interactive clapperboard pinned to the page. Click it, or let the intro trigger it. */
export function ClapperWidget() {
  const lite = useLite();
  const [key, setKey] = useState(0);
  const [call, setCall] = useState("");
  const take = useRef(1);

  useEffect(() => {
    const go = () => { setKey((k) => k + 1); setCall(take.current++ % 2 ? "ACTION!" : "CUT!"); };
    window.addEventListener("karam:clap", go);
    return () => window.removeEventListener("karam:clap", go);
  }, []);
  useEffect(() => { if (!call) return; const id = setTimeout(() => setCall(""), 900); return () => clearTimeout(id); }, [call, key]);

  if (lite) return null;
  return (
    <div className="fixed bottom-14 start-3 z-40 h-28 w-40">
      {call && <span key={key} className="callout-pop font-neon absolute -top-8 start-0 text-3xl text-brand-light" aria-live="polite">{call}</span>}
      <button type="button" aria-label="Clapperboard" onClick={() => window.dispatchEvent(new Event("karam:clap"))} className="absolute inset-0 cursor-pointer">
        <ClapperCanvas accent="#00F0FF" clapKey={key} />
      </button>
    </div>
  );
}
