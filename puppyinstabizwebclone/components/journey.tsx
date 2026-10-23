import Link from "next/link";
import { journeySteps } from "@/lib/data";
import { Delivery, Handshake, Photos } from "./icons";
import WhatsAppCard from "./whatsapp-chat";

const skyVars = {
  "--sky-top": "#f7d18d",
  "--sky-bottom": "#f0b866",
} as React.CSSProperties;

const icons = [Handshake, Photos, Delivery];

export default function Journey() {
  return (
    <section
      id="journey"
      className="tp-scene tp-journey"
      style={skyVars}
      aria-labelledby="journey-title"
    >
      <div className="gutter mx-auto max-w-[110rem] pb-[clamp(4rem,9vh,6.5rem)]">
        <div className="mx-auto max-w-[22ch] text-center">
          <p className="tp-kicker font-scrawl">your puppy journey</p>
          <h2 id="journey-title" className="tp-title font-plush mt-1">
            Your puppy journey
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-[var(--ink-soft)]">
            A premium, step-by-step concierge experience. We make adoption
            simple, secure, and purely joyful.
          </p>
        </div>

        <div className="tp-journey__grid mt-[clamp(2rem,4vw,3rem)]">
          {/* left — the journey detail; the only column that scrolls */}
          <div className="tp-journey__left">
            <ol className="tp-steps">
              {journeySteps.map((step, i) => {
                const Icon = icons[i] ?? Handshake;
                return (
                  <li
                    key={step.title}
                    className="tp-step"
                    style={{ "--tint": step.tint } as React.CSSProperties}
                  >
                    <span className="tp-step__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="tp-step__num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="tp-step__title">{step.title}</h3>
                    <p className="tp-step__text">{step.text}</p>
                  </li>
                );
              })}
            </ol>

            <div id="journey-cta" className="tp-journey__cta">
              <Link href="/how-it-works" className="btn btn-ghost">
                How it works
              </Link>
            </div>
          </div>

          {/* right — the WhatsApp chat stays put */}
          <div className="tp-journey__right">
            <WhatsAppCard />
          </div>
        </div>
      </div>
    </section>
  );
}