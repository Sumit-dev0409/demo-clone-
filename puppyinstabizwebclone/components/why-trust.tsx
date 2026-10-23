import { CDN, passports } from "@/lib/data";
import { Paw } from "./icons";

const skyVars = {
  "--sky-top": "#f0b866",
  "--sky-bottom": "#a65a30",
} as React.CSSProperties;

export default function WhyTrust() {
  return (
    <section
      id="trust"
      className="tp-scene tp-passport"
      style={skyVars}
      aria-labelledby="trust-title"
    >
      <div className="gutter mx-auto max-w-[96rem] pt-[clamp(4rem,9vh,6.5rem)]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p className="tp-book__kicker font-scrawl">puppy passport</p>
            <h2 id="trust-title" className="tp-book__title font-plush">
              Why families trust TeddyPups
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${CDN}/_next/image?url=%2Fbrand%2Flogo.png&w=256&q=75`}
              alt=""
              aria-hidden="true"
              className="mt-6 w-[clamp(7rem,22vw,10rem)] object-contain"
              loading="lazy"
            />
          </div>

          <div className="tp-book__page tp-book__page--right">
            {passports.map((p) => (
              <div
                key={p.title}
                className="tp-passport-card"
                style={{ "--stamp": p.ink } as React.CSSProperties}
              >
                <span className="tp-passport-card__stamp" aria-hidden="true">
                  <Paw className="size-6" />
                </span>
                <h3 className="tp-passport-card__title">{p.title}</h3>
                <p className="tp-passport-card__text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}