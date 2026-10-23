"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/lib/data";

const skyVars = {
  "--sky-top": "#4d2b19",
  "--sky-bottom": "#2f1a10",
} as React.CSSProperties;

const tilts = ["-1.6deg", "1.1deg", "-1deg"];
const pins = ["#c2622b", "#f2be6b", "#a24a1a"];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="questions"
      className="tp-scene tp-night"
      style={skyVars}
      data-tone="dark"
      aria-labelledby="faq-title"
    >
      <div className="gutter mx-auto max-w-[110rem] py-[clamp(4rem,9vh,7rem)]">
        <div className="tp-head">
          <div>
            <p className="tp-kicker font-scrawl">questions, answered</p>
            <h2 id="faq-title" className="tp-title font-plush mt-1">
              Questions, answered
            </h2>
          </div>
          <Link href="/faq" className="btn btn-ghost">
            Read all questions
          </Link>
        </div>

        <div className="tp-notes mt-[clamp(2rem,5vh,3.5rem)]">
          <div className="tp-notes__board">
            <div className="tp-notes__list">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={f.q}
                    className="tp-note"
                    data-unfolded={isOpen ? "" : undefined}
                    style={
                      {
                        "--tilt": tilts[i % tilts.length],
                        "--pin": pins[i % pins.length],
                      } as React.CSSProperties
                    }
                  >
                    <span className="tp-note__pin" aria-hidden="true" />
                    <div className="tp-note__q">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : i)}
                      >
                        <span>{f.q}</span>
                        <span className="tp-note__chevron" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="tp-note__answer">
                      <div className="tp-note__flap">
                        <p>{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}