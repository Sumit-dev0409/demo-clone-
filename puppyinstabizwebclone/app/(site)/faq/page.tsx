import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/faq-accordion";
import { WHATSAPP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Questions & answers — TeddyPups",
  description:
    "Answers about vaccination, meeting a puppy before you decide, same-day collection, importing a puppy from abroad, delivery and aftercare.",
};

const skyVars = {
  "--sky-top": "#4d2b19",
  "--sky-bottom": "#2f1a10",
} as React.CSSProperties;

export default function FaqPage() {
  return (
    <div className="tp-page">
      <section
        className="tp-scene"
        style={skyVars}
        data-tone="dark"
        aria-labelledby="faq-title"
      >
        <div className="gutter mx-auto max-w-[110rem] py-[clamp(4rem,9vh,7rem)]">
          <div className="tp-head">
            <div>
              <p className="tp-kicker font-scrawl">questions, answered</p>
              <h1 id="faq-title" className="tp-title font-plush mt-1">
                Questions &amp; answers
              </h1>
              <p className="tp-page__lede mt-4 text-[1.1rem]">
                Everything families usually ask before bringing a Teddy Pup home.
                Still curious about something? Just message us.
              </p>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Ask on WhatsApp
            </a>
          </div>

          <FaqAccordion />

          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] text-center">
            <p className="font-scrawl text-[clamp(1.2rem,2.4vw,1.7rem)] text-honey">
              ready when you are
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
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