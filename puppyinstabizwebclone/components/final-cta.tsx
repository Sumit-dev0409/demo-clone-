import Link from "next/link";
import { availablePuppies, img, WHATSAPP } from "@/lib/data";
import { WhatsApp } from "./icons";

const skyVars = {
  "--sky-top": "#2f1a10",
  "--sky-bottom": "#24130b",
} as React.CSSProperties;

export default function FinalCta() {
  return (
    <section
      id="cta"
      className="tp-scene tp-home"
      style={skyVars}
      data-tone="dark"
      aria-labelledby="cta-title"
    >
      <div className="gutter mx-auto max-w-[110rem] pt-[clamp(4rem,9vh,7rem)] text-center">
        <p className="tp-kicker font-scrawl">welcome home</p>
        <h2 id="cta-title" className="tp-title font-plush mx-auto mt-2 max-w-[18ch]">
          Ready to meet your new best friend?
        </h2>
        <p className="mx-auto mt-4 max-w-[54ch] text-[var(--ink-soft)]">
          Bring home a healthy, happy teacup or designer puppy with expert
          guidance every step of the way. We help you find the right match and
          ensure a smooth, safe delivery across the UAE.
        </p>

        <div className="tp-home__actions mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <WhatsApp className="size-5" />
            Enquire on WhatsApp
          </a>
          <Link href="/contact" className="btn btn-ghost">
            Visit &amp; contact
          </Link>
        </div>

        <div className="tp-house" aria-hidden="true">
          <div className="tp-house__doorway">
            <div className="tp-house__inside">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img(availablePuppies[0].media, 640)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="tp-house__peep" />
            <div className="tp-house__door">
              <span className="tp-house__knob" />
            </div>
          </div>
          <div className="tp-house__mat font-scrawl">welcome home</div>
        </div>
      </div>
    </section>
  );
}