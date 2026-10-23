"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PAW_PATH, PUP_RUNNER_ART } from "@/lib/pup-art";

const HOLD_MS = 380; // how long the cloud blanket sits before it lifts
const LIFT_MS = 320; // matches the blanket's CSS transition
const RUN_S = (HOLD_MS + LIFT_MS) / 1000; // keep in step with `.tp-curtain-run`

// Paw prints dropped along the runner's path, with the moment they land.
const PRINTS = [12, 27, 42, 57, 72, 87].map((p, i) => ({
  key: i,
  left: `${p}%`,
  delay: `${(((p + 20) / 138) * RUN_S).toFixed(2)}s`,
}));

// Module-level so the very first paint (and React's double-invoked effects)
// never plays the curtain — only real route changes do.
let lastPath: string | null = null;

export default function PupCurtain() {
  const pathname = usePathname();
  const timers = useRef<number[]>([]);
  const [on, setOn] = useState(false);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    const changed = lastPath !== null && lastPath !== pathname;
    lastPath = pathname;
    if (!changed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setLifting(false);
    setOn(true);
    timers.current = [
      window.setTimeout(() => setLifting(true), HOLD_MS),
      window.setTimeout(() => setOn(false), HOLD_MS + LIFT_MS),
    ];

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [pathname]);

  if (!on) return null;

  return (
    <div className="tp-curtain" data-lifting={lifting} aria-hidden="true">
      <div className="tp-curtain__blanket">
        <div className="tp-curtain__stage">
          {PRINTS.map((print) => (
            <svg
              key={print.key}
              className="tp-curtain__print"
              viewBox="0 0 64 64"
              style={
                {
                  "--p": print.left,
                  "--d": print.delay,
                } as React.CSSProperties
              }
            >
              <path d={PAW_PATH} />
            </svg>
          ))}

          <div className="tp-curtain__runner">
            <div
              className="tp-curtain__runner-art"
              dangerouslySetInnerHTML={{ __html: PUP_RUNNER_ART }}
            />
          </div>

          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>

        <svg
          className="tp-curtain__edge"
          width="100%"
          height="40"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="tp-curtain-scallop"
              width="76"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 40V27A38 25 0 0 1 76 27V40Z"
                className="tp-curtain__scallop-fill"
              />
              <path
                d="M0 27A38 25 0 0 1 76 27"
                className="tp-curtain__scallop-line"
              />
              <path
                d="M11 33A27 19 0 0 1 65 33"
                className="tp-curtain__scallop-dash"
              />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>
      </div>
    </div>
  );
}