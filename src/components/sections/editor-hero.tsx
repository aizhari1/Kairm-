import Image from "next/image";
import Link from "next/link";
import { karam } from "@/lib/karam";

const L = { en: { reels: "Watch the reels", contact: "Hire me", rec: "REC" }, ar: { reels: "شوف الأعمال", contact: "كلمني", rec: "REC" } };

/** Top of the home page: portrait in a camera viewfinder, name, role, bio, and a mini timeline. */
export function EditorHero({ locale }: { locale: string }) {
  const k = locale === "ar" ? "ar" : "en";
  const l = L[k];
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1fr_minmax(0,24rem)] md:py-20">
      <div className="order-2 md:order-1">
        <p className="digital mb-3 text-sm text-brand-light">{karam.role.en} / {karam.role.ar}</p>
        <h1 className="text-[clamp(4rem,15vw,9rem)] leading-none tracking-wide">{karam.name}</h1>
        <p className="mt-4 max-w-xl text-xl text-white">{karam.tagline[k]}</p>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{karam.bio[k]}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {karam.tools.map((tool) => <li key={tool} className="digital rounded border border-brand/40 bg-brand/10 px-3 py-1 text-sm">{tool}</li>)}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/${locale}/portfolio`} className="inline-flex min-h-12 items-center rounded-md border-2 border-brand px-6 text-brand shadow-[0_0_14px_rgb(0_240_255/0.35)] hover:bg-brand hover:text-bg">{l.reels}</Link>
          <Link href={`/${locale}/contact`} className="inline-flex min-h-12 items-center rounded-md border border-white/30 px-6 hover:border-brand-light hover:text-brand-light">{l.contact}</Link>
        </div>
        <div aria-hidden className="relative mt-9 max-w-xl space-y-1.5 overflow-hidden rounded-md border border-brand/25 bg-card/60 p-2" dir="ltr">
          {[["V2", "left-[8%] w-[26%] border-brand-light bg-brand-light/20"], ["V1", "left-0 w-[46%] border-brand bg-brand/20"], ["A1", "left-[12%] w-[70%] border-violet-400 bg-violet-400/20"]].map(([t, c]) => (
            <div key={t} className="relative h-5 rounded-sm bg-white/5"><span className="digital absolute -left-0.5 -top-px z-10 px-1 text-[10px] text-muted">{t}</span><span className={`absolute inset-y-0.5 rounded-sm border ${c}`} /></div>
          ))}
          <span className="sweep absolute inset-y-0 w-0.5 bg-brand-light shadow-[0_0_8px_var(--color-brand-light)]" />
        </div>
      </div>

      <figure className="order-1 md:order-2" aria-label={karam.name}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-card shadow-[0_0_40px_rgb(0_240_255/0.25)]">
          {karam.photo ? (
            <Image src={karam.photo} alt={karam.name} fill priority sizes="(min-width: 768px) 24rem, 90vw" className="object-cover" />
          ) : (
            <div className="grid size-full place-items-center bg-gradient-to-br from-card to-bg"><span className="neon-glow text-[10rem] leading-none">K</span></div>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(255_255_255/0.05)_0_1px,transparent_1px_3px)]" />
          {["top-3 start-3 border-t-2 border-s-2", "top-3 end-3 border-t-2 border-e-2", "bottom-3 start-3 border-b-2 border-s-2", "bottom-3 end-3 border-b-2 border-e-2"].map((c) => <span key={c} aria-hidden className={`absolute size-7 border-brand ${c}`} />)}
          <span aria-hidden className="digital absolute start-5 top-5 flex items-center gap-2 text-sm text-white"><i className="size-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />{l.rec}</span>
          <span aria-hidden className="digital absolute end-5 top-5 text-sm text-white">24 FPS · 4K</span>
          <figcaption className="digital absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent px-5 pb-5 pt-10 text-sm text-brand">KARAM_MAIN.mov</figcaption>
        </div>
      </figure>
    </section>
  );
}
