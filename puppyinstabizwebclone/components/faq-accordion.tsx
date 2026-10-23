"use client";

import { useState } from "react";
import { faqsFull } from "@/lib/data";

const tilts = ["-1.6deg", "1.1deg", "-1deg", "0.8deg", "-0.7deg"];
const pins = ["#c2622b", "#f2be6b", "#a24a1a", "#5a3a28", "#d4893f"];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="tp-notes">
      <div className="tp-notes__board">
        <div className="tp-notes__list">
          {faqsFull.map((f, i) => {
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
  );
}