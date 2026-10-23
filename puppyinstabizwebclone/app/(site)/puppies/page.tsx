import type { Metadata } from "next";
import Link from "next/link";
import {
  breeds,
  goneHome,
  img,
  WHATSAPP,
} from "@/lib/data";
import { getPuppies } from "@/lib/puppies";

export const metadata: Metadata = {
  title: "Available puppies — TeddyPups",
  description:
    "Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.",
};

const skyVars = {
  "--sky-top": "#fbe3b4",
  "--sky-bottom": "#fffdf8",
} as React.CSSProperties;

const origins = [
  { label: "All puppies", href: "/puppies", value: "" },
  { label: "In Dubai", href: "/puppies?origin=local", value: "local" },
  { label: "Imported", href: "/puppies?origin=imported", value: "imported" },
];

type Props = {
  searchParams: Promise<{ breed?: string; origin?: string }>;
};

export default async function PuppiesPage({ searchParams }: Props) {
  const { breed, origin } = await searchParams;
  const puppies = await getPuppies({ breed, origin, status: "available" });
  const activeBreed = breed ?? "";
  const activeOrigin = origin === "local" || origin === "imported" ? origin : "";

  return (
    <div className="tp-page">
      <section
        className="tp-scene"
        style={skyVars}
        data-tone="light"
        aria-labelledby="pups-title"
      >
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__head">
            <div>
              <p className="tp-kicker font-scrawl">from Teddy&apos;s sketchbook</p>
              <h1 id="pups-title" className="tp-title font-plush tp-sketchbook__title mt-1">
                Available puppies
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  className="tp-sketchbook__underline"
                >
                  <path
                    d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1"
                    pathLength={1}
                  />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede mt-6 text-[1.08rem] leading-relaxed">
                Every listing shows real photos of the actual puppy. Open a profile
                to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self">
              <span className="tp-chip font-scrawl">Teddy&apos;s picks</span>
              <span className="tp-sketchbook__caption font-scrawl">
                {puppies.length} puppy{puppies.length === 1 ? "" : "s"} available
              </span>
            </div>
          </div>

          <div className="tp-filters">
            {origins.map((o) => (
              <Link
                key={o.value || "all"}
                href={o.href}
                className="tp-chip"
                data-on={activeOrigin === o.value && !activeBreed ? "true" : "false"}
              >
                {o.label}
              </Link>
            ))}
            <span className="tp-filters__label">or breed:</span>
            {breeds.map((b) => {
              const value = b.href.split("=")[1];
              return (
                <Link
                  key={b.label}
                  href={b.href}
                  className="tp-chip"
                  data-on={activeBreed === value ? "true" : "false"}
                >
                  {b.label}
                </Link>
              );
            })}
          </div>

          {puppies.length === 0 ? (
            <div className="tp-empty">
              <p className="font-plush-text text-[1.25rem]">
                No puppies match that filter right now.
              </p>
              <p className="mt-2">
                Tell us what you&apos;re looking for and we&apos;ll let you know as
                soon as one arrives.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp mt-5"
              >
                Ask on WhatsApp
              </a>
            </div>
          ) : (
            <ul className="tp-sketches">
              {puppies.map((p, i) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="tp-sketch"
                    style={{ "--tilt": `${(i % 3) - 1}deg` } as React.CSSProperties}
                    aria-label={`${p.name}, ${p.meta}, available`}
                  >
                    <span
                      className="tp-sketch__sticker"
                      style={{ "--wash": p.door } as React.CSSProperties}
                    >
                      {p.origin === "local" ? "In Dubai" : "Imported"}
                    </span>
                    <span className="tp-sketch__frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img(p.media, 640)}
                        alt={`${p.name} — ${p.meta}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="tp-sketch__name font-plush-text">{p.name}</span>
                    <span className="tp-sketch__meta">{p.meta}</span>
                    {p.meta.includes("video") && (
                      <span className="tp-sketch__video">
                        <svg
                          viewBox="0 0 24 24"
                          width="15"
                          height="15"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                        </svg>
                        with video
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="tp-gone-strip">
            <div className="tp-head">
              <div>
                <p className="tp-kicker font-scrawl">already gone home</p>
                <h2 className="tp-title font-plush mt-1 text-[clamp(1.8rem,4vw,2.8rem)]">
                  These puppies have found their families.
                </h2>
              </div>
              <Link href="/happy-families" className="btn btn-ghost">
                See the happy families
              </Link>
            </div>
            <ul className="tp-gone-strip__list">
              {goneHome.map((g) => (
                <li key={g.slug}>
                  <Link href={`/puppies/${g.slug}`} className="tp-gone-chip">
                    {g.name} <small>· {g.meta}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}