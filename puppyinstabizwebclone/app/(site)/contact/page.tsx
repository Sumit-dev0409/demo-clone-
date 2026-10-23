import type { Metadata } from "next";
import LetterForm from "@/components/letter-form";
import {
  ADDRESS,
  EMAIL,
  TELEPHONE,
  WHATSAPP,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Visit & contact — TeddyPups",
  description:
    "Have questions about our puppies or adoption process? Reach us on WhatsApp, call us, or send us a letter from our Downtown Dubai showroom.",
};

const skyVars = {
  "--sky-top": "#f7d18d",
  "--sky-bottom": "#a65a30",
} as React.CSSProperties;

const telHref = `tel:${TELEPHONE.replace(/\s/g, "")}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Downtown Dubai, United Arab Emirates",
)}`;

export default function ContactPage() {
  return (
    <div className="tp-page">
      <section
        className="tp-scene"
        style={skyVars}
        data-tone="light"
        aria-labelledby="contact-title"
      >
        <div className="gutter mx-auto max-w-[110rem] py-[clamp(4rem,9vh,7rem)]">
          <div className="tp-head">
            <div>
              <p className="tp-kicker font-scrawl">say hello</p>
              <h1 id="contact-title" className="tp-title font-plush mt-1">
                Get in touch with us
              </h1>
              <p className="tp-page__lede mt-4 text-[1.1rem]">
                Have questions about our puppies or adoption process? Fill out the
                form below, or reach us directly — we reply fast.
              </p>
            </div>
          </div>

          <div className="mt-[clamp(2rem,5vh,3rem)] max-w-[52rem]">
            <LetterForm />
          </div>

          <div className="tp-contactcards">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-contactcard"
            >
              <span className="tp-contactcard__label">WhatsApp us</span>
              <span className="tp-contactcard__value">{TELEPHONE}</span>
              <span className="text-[var(--color-cocoa-soft)]">
                Quickest way to see photos and videos.
              </span>
            </a>
            <a href={telHref} className="tp-contactcard">
              <span className="tp-contactcard__label">Call us</span>
              <span className="tp-contactcard__value">{TELEPHONE}</span>
              <span className="text-[var(--color-cocoa-soft)]">
                Happy to talk through your options.
              </span>
            </a>
            <a href={`mailto:${EMAIL}`} className="tp-contactcard">
              <span className="tp-contactcard__label">Email us</span>
              <span className="tp-contactcard__value break-all">{EMAIL}</span>
              <span className="text-[var(--color-cocoa-soft)]">
                For detailed questions and paperwork.
              </span>
            </a>
          </div>

          <div className="tp-paper mt-[clamp(2.5rem,5vw,3.5rem)]">
            <h2 className="font-plush text-[clamp(1.5rem,3vw,2.1rem)]">
              Visit us in Downtown Dubai
            </h2>
            <p className="mt-3 text-[var(--color-cocoa-soft)]">{ADDRESS}</p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-5"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}