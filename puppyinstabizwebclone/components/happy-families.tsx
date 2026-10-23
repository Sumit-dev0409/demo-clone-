import Link from "next/link";
import { img, polaroids, testimonial } from "@/lib/data";

const skyVars = {
  "--sky-top": "#a65a30",
  "--sky-bottom": "#4d2b19",
} as React.CSSProperties;

export default function HappyFamilies() {
  return (
    <section
      id="families"
      className="tp-scene tp-dusk"
      style={skyVars}
      data-tone="dark"
      aria-labelledby="families-title"
    >
      <div className="gutter mx-auto max-w-[110rem] py-[clamp(4rem,9vh,7rem)]">
        <div className="tp-head">
          <div>
            <p className="tp-kicker font-scrawl">happy families</p>
            <h2 id="families-title" className="tp-title font-plush mt-1">
              Happy families &amp; puppies
            </h2>
            <p className="mt-3 max-w-[52ch] text-[var(--ink-soft)]">
              We are truly honored to see our puppies become cherished members of
              loving families. These heartwarming moments have been shared by our
              valued clients who welcomed a Teddy Pup into their homes and hearts.
            </p>
          </div>
        </div>

        <figure className="mt-[clamp(2rem,5vh,3rem)] mx-auto max-w-[46rem] rounded-[1.4rem] border-[3px] border-cocoa bg-milk p-[clamp(1.4rem,4vw,2.5rem)] text-cocoa shadow-[8px_12px_#00000030]">
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

        <div className="mt-[clamp(2rem,4vw,3rem)] text-center">
          <Link href="/happy-families" className="btn btn-ghost">
            See every happy family
          </Link>
        </div>
      </div>
    </section>
  );
}