import type { Metadata } from "next";
import Link from "next/link";
import { familyCount, img, polaroids, testimonial, WHATSAPP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Happy families — TeddyPups",
  description:
    "Nothing makes us happier than seeing our puppies in loving homes. Meet the families who welcomed a Teddy Pup.",
};

const skyVars = {
  "--sky-top": "#a65a30",
  "--sky-bottom": "#4d2b19",
} as React.CSSProperties;

export default function HappyFamiliesPage() {
  return (
    <div className="tp-page">
      <section
        className="tp-scene"
        style={skyVars}
        data-tone="dark"
        aria-labelledby="families-title"
      >
        <div className="gutter mx-auto max-w-[110rem] py-[clamp(4rem,9vh,7rem)]">
          <div className="tp-head">
            <div>
              <p className="tp-kicker font-scrawl">our wall of happy endings</p>
              <h1 id="families-title" className="tp-title font-plush mt-1">
                Happy families
              </h1>
              <p className="tp-page__lede mt-4 text-[1.1rem]">
                Nothing makes us happier than seeing our puppies in loving homes!
                These heartwarming moments were shared by the families who welcomed
                a Teddy Pup into their lives.
              </p>
            </div>
            <div className="text-right">
              <span className="font-plush block text-[clamp(2.6rem,7vw,4rem)] leading-none text-honey">
                {familyCount}
              </span>
              <span className="font-scrawl text-[var(--ink-soft)]">
                moments and counting
              </span>
            </div>
          </div>

          <figure className="mx-auto mt-[clamp(2rem,5vh,3rem)] max-w-[46rem] rounded-[1.4rem] border-[3px] border-cocoa bg-milk p-[clamp(1.4rem,4vw,2.5rem)] text-cocoa shadow-[8px_12px_#00000030]">
            <blockquote className="font-plush-text text-[clamp(1.15rem,1.8vw,1.5rem)] leading-snug">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="font-scrawl mt-4 text-toffee-ink">
              {testimonial.author}
            </figcaption>
          </figure>

          <div className="tp-photowall">
            <div className="tp-photowall__wall">
              <ul className="tp-photowall__prints">
                {polaroids.map((p) => (
                  <li key={p.media} className="tp-photowall__print">
                    <div
                      className="tp-polaroid"
                      style={{ "--tilt": `${p.tilt}deg` } as React.CSSProperties}
                    >
                      <span
                        className={`tp-tape tp-tape--${p.tapePos}`}
                        style={{ "--tape": p.tape } as React.CSSProperties}
                      />
                      <span className="tp-polaroid__photo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img(p.media, 384)}
                          alt={p.caption}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="tp-polaroid__caption">{p.caption}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] text-center">
            <p className="font-scrawl text-[clamp(1.2rem,2.4vw,1.7rem)] text-honey">
              every one of them was a Teddy Pup once
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/puppies" className="btn btn-primary">
                See available puppies
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Start your story
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}