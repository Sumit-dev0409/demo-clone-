import type { Metadata } from "next";
import Link from "next/link";
import { lanes, promises, WHATSAPP } from "@/lib/data";

export const metadata: Metadata = {
  title: "How it works — TeddyPups",
  description:
    "Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.",
};

const skyVars = {
  "--sky-top": "#fbe3b4",
  "--sky-bottom": "#f7d18d",
} as React.CSSProperties;

const chapters = [
  {
    title: "Two ways home",
    text: "Meet a puppy here in Dubai, or let us import a premium teacup breed for you.",
  },
  {
    title: "Our premium puppy promise",
    text: "Hand-selected breeders, full transparency, and safe, stress-free delivery.",
  },
  {
    title: "Delivery & collection",
    text: "Collect in our Downtown Dubai showroom or have your puppy delivered to your door.",
  },
  {
    title: "Why choose us",
    text: "Real photos, verified health, honest advice, and support that continues after you come home.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="tp-page">
      <section
        className="tp-scene"
        style={skyVars}
        data-tone="light"
        aria-labelledby="how-title"
      >
        <div className="gutter mx-auto max-w-[110rem] py-[clamp(4rem,9vh,7rem)]">
          <div className="tp-head">
            <div>
              <p className="tp-kicker font-scrawl">the TeddyPups way</p>
              <h1 id="how-title" className="tp-title font-plush mt-1">
                How it works
              </h1>
              <p className="tp-page__lede mt-4 text-[1.1rem]">
                Whether you choose to visit us locally or order a premium breed from
                overseas, TeddyPups is here to make the experience unforgettable.
              </p>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Ask a question
            </a>
          </div>

          <ul className="tp-chapters">
            {chapters.map((c, i) => (
              <li key={c.title} className="tp-chapter">
                <span className="tp-chapter__n">{i + 1}</span>
                <span>
                  <span className="block font-plush-text text-[1.25rem] font-bold">
                    {c.title}
                  </span>
                  <span className="tp-trail__text block">{c.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="tp-lanes">
            {lanes.map((lane) => (
              <article key={lane.id} className="tp-lane" aria-labelledby={`lane-${lane.id}`}>
                <div className="tp-lane__head">
                  <h2 id={`lane-${lane.id}`} className="font-plush text-[clamp(1.5rem,3vw,2.1rem)]">
                    {lane.tag}
                  </h2>
                  <span className="tp-lane__badge">{lane.badge}</span>
                  <span className="tp-lane__place font-scrawl">{lane.place}</span>
                </div>
                <div className="tp-trail">
                  {lane.steps.map((s, i) => (
                    <div key={s.title} className="tp-trail__row">
                      <span className="tp-trail__num">{i + 1}</span>
                      <span>
                        <span className="tp-trail__title">{s.title}</span>
                        <span className="tp-trail__text block">{s.text}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={lane.id === "local" ? "/puppies?origin=local" : "/puppies?origin=imported"}
                  className="btn btn-ghost mt-2 self-start"
                >
                  {lane.id === "local" ? "Meet local puppies" : "See imported puppies"}
                </Link>
              </article>
            ))}
          </div>

          <h2 className="tp-title font-plush mt-[clamp(3rem,6vw,4.5rem)] text-[clamp(1.8rem,4vw,2.8rem)]">
            Our premium puppy promise
          </h2>
          <div className="tp-promises">
            {promises.map((p, i) => (
              <div key={p.title} className="tp-step" style={{ "--tint": "#fbe3b4" } as React.CSSProperties}>
                <span className="tp-step__num font-scrawl">0{i + 1}</span>
                <span className="tp-step__title">{p.title}</span>
                <span className="tp-step__text">{p.text}</span>
              </div>
            ))}
          </div>

          <div className="tp-paper mt-[clamp(2.5rem,5vw,3.5rem)]">
            <h2 className="font-plush text-[clamp(1.5rem,3vw,2.1rem)]">
              Delivery &amp; collection
            </h2>
            <p className="mt-3 text-[var(--color-cocoa-soft)]">
              Collect your puppy in our Downtown Dubai showroom, or choose safe
              delivery anywhere in the UAE. For imported puppies, we handle the full
              journey and hand over once your puppy has arrived and settled.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/puppies" className="btn btn-primary">
                See available puppies
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Visit &amp; contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}