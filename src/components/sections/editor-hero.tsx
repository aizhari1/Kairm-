import Image from "next/image";
import Link from "next/link";
import { karam } from "@/lib/karam";

const L = {
  en: { reels: "Watch the reels", contact: "Hire me", rec: "REC" },
  ar: { reels: "شوف الأعمال", contact: "كلمني", rec: "REC" },
};

/** Top of the home page: portrait in a camera viewfinder, name, role, bio, mini timeline. */
export function EditorHero({ locale }: { locale: string }) {
  const k = locale === "ar" ? "ar" : "en";
  const l = L[k];
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1fr_minmax(0,24rem)] md:py-20">
      <div className="order-2 md:order-1">
        <p className="digital mb-3 text-sm text-brand">{karam.role.en} / {karam.role.ar}</p>
        <h1 className="font-display text-[clamp(3.5rem,12vw,7.5rem)] leading-[0.95]">{karam.name}</h1>
        <p className="mt-5 max-w-xl text-xl font-medium text-white">{karam.tagline[k]}</p>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{karam.bio[k]}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {karam.tools.map((tool) => (
            <li key={tool} className="digital rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              {tool}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex min-h-12 items-center rounded-xl bg-brand px-6 font-semibold text-bg transition hover:brightness-110"
          >
            {l.reels}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex min-h-12 items-center rounded-xl border border-white/15 px-6 text-white transition hover:border-brand hover:text-brand"
          >
            {l.contact}
          </Link>
        </div>
        <div aria-hidden className="relative mt-10 max-w-xl space-y-1.5 overflow-hidden rounded-lg border border-white/10 bg-card p-2" dir="ltr">
          {[
            ["V2", "left-[8%] w-[26%]"],
            ["V1", "left-0 w-[46%]"],
            ["A1", "left-[12%] w-[70%]"],
          ].map(([t, pos]) => (
            <div key={t} className="relative h-5 rounded-sm bg-white/5">
              <span className="digital absolute -left-0.5 -top-px z-10 px-1 text-[10px] text-muted">{t}</span>
              <span className={`absolute inset-y-0.5 rounded-sm border border-brand/50 bg-brand/15 ${pos}`} />
            </div>
          ))}
          <span className="sweep absolute inset-y-0 w-0.5 bg-brand" />
        </div>
      </div>

      <figure className="order-1 md:order-2" aria-label={karam.name}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-card">
          {karam.photo ? (
            <Image src={karam.photo} alt={karam.name} fill priority sizes="(min-width: 768px) 24rem, 90vw" className="object-cover" />
          ) : (
            <div className="grid size-full place-items-center bg-gradient-to-br from-card to-bg">
              <span className="font-display text-[9rem] leading-none text-brand">K</span>
            </div>
          )}
          {["top-3 start-3 border-t-2 border-s-2", "top-3 end-3 border-t-2 border-e-2", "bottom-3 start-3 border-b-2 border-s-2", "bottom-3 end-3 border-b-2 border-e-2"].map((c) => (
            <span key={c} aria-hidden className={`absolute size-6 border-brand/80 ${c}`} />
          ))}
          <span aria-hidden className="digital absolute start-4 top-4 flex items-center gap-2 text-xs text-white">
            <i className="size-2 animate-pulse rounded-full bg-red-500" />
            {l.rec}
          </span>
          <span aria-hidden className="digital absolute end-4 top-4 text-xs text-muted">
            24 FPS · 4K
          </span>
          <figcaption className="digital absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent px-4 pb-4 pt-12 text-xs text-brand">
            KARAM_MAIN.mov
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
