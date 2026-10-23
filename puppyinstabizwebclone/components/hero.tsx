import Link from "next/link";
import { img, lineup, WHATSAPP } from "@/lib/data";
import { WhatsApp } from "./icons";

const skyVars = {
  "--sky-top": "#fffdf8",
  "--sky-bottom": "#fff1d8",
  "--quilt": "#fff1d8",
} as React.CSSProperties;

export default function Hero() {
  return (
    <section
      id="hero"
      className="tp-scene tp-hero"
      style={skyVars}
      aria-labelledby="hero-title"
    >
      <span aria-hidden="true" className="tp-hero__sun" />

      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl relative">
          every puppy is family
          <svg
            viewBox="0 0 220 24"
            preserveAspectRatio="none"
            className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
            aria-hidden="true"
          >
            <path
              d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 28-9 46 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </p>

        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="block">Premium teacup</span>
          <span className="block">puppies in Dubai</span>
        </h1>

        <p className="tp-hero__lede">
          Meet your new best friend in our Dubai showroom, or order a rare
          miniature breed from trusted breeders worldwide.
        </p>

        <div className="tp-hero__actions">
          <Link href="/puppies" className="btn btn-primary">
            View available puppies
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <WhatsApp className="size-5" />
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      <div className="tp-hero__stage">
        <ul
          className="tp-lineup"
          aria-label="Some of the puppies in our showroom"
        >
          {lineup.map((pup, i) => (
            <li
              key={pup.href}
              className="tp-lineup__seat"
              style={
                {
                  "--x": `${pup.x}%`,
                  "--w": pup.w,
                  "--peek": pup.peek,
                  "--tilt": `${pup.tilt}deg`,
                  "--i": i,
                } as React.CSSProperties
              }
            >
              <Link
                href={pup.href}
                className="tp-lineup__pup"
                aria-label={`Meet ${pup.name}`}
              >
                <span className="tp-lineup__name">{pup.name}</span>
                <span className="tp-lineup__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(pup.media, 384)}
                    alt={`${pup.name} puppy`}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="tp-quilt" aria-hidden="true" />
      </div>
    </section>
  );
}