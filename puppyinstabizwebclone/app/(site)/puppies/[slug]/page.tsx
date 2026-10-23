import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  availablePuppies,
  goneHome,
  img,
  WHATSAPP,
} from "@/lib/data";
import { getPuppyBySlug } from "@/lib/puppies";

const skyVars = {
  "--sky-top": "#fffdf8",
  "--sky-bottom": "#fbe3b4",
} as React.CSSProperties;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [
    ...availablePuppies.map((p) => ({ slug: p.href.replace("/puppies/", "") })),
    ...goneHome.map((g) => ({ slug: g.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const puppy = await getPuppyBySlug(slug);
  if (puppy && puppy.status !== "gone_home") {
    return {
      title: `${puppy.name} — a TeddyPup in Dubai`,
      description: `${puppy.name}, ${puppy.meta}. See photos and health details, then ask us about ${puppy.name} on WhatsApp.`,
    };
  }
  if (puppy && puppy.status === "gone_home") {
    return { title: `${puppy.name} has gone home — TeddyPups` };
  }
  return { title: "Puppy not found — TeddyPups" };
}

const promises = [
  "Vaccinated, dewormed and vet-checked",
  "Verified health certificate included",
  "Real photos and video before you decide",
  "24/7 support before and after coming home",
];

export default async function PuppyPage({ params }: Props) {
  const { slug } = await params;
  const puppy = await getPuppyBySlug(slug);

  if (!puppy) {
    notFound();
  }

  if (puppy.status === "gone_home") {
    return (
      <div className="tp-page">
        <section className="tp-scene" style={skyVars} data-tone="light">
          <div className="gutter mx-auto max-w-[70rem] py-[clamp(4rem,10vh,7rem)] text-center">
            <p className="tp-kicker font-scrawl">already gone home</p>
            <h1 className="tp-title font-plush mt-2">{puppy.name}</h1>
            <p className="tp-page__lede mx-auto mt-4 text-[1.1rem]">
              {puppy.name} ({puppy.meta}) has already found a loving family. Some
              of their happiest moments are on our wall of happy endings.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/happy-families" className="btn btn-primary">
                See happy families
              </Link>
              <Link href="/puppies" className="btn btn-ghost">
                See available puppies
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }


  const imported = puppy.origin === "imported";
  const ask = `https://wa.me/971541676733?text=${encodeURIComponent(
    `Hi TeddyPups! I'd love to know more about ${puppy.name} (${puppy.meta}).`,
  )}`;
  const more = availablePuppies.filter((p) => p.href !== puppy.href).slice(0, 3);

  return (
    <div className="tp-page">
      <section
        className="tp-scene"
        style={skyVars}
        data-tone="light"
        aria-labelledby="pup-title"
      >
        <div className="gutter mx-auto max-w-[110rem] py-[clamp(2.5rem,7vh,5rem)]">
          <div className="tp-board">
            <div className="tp-paper tp-paper--photo">
              <span className="tp-paper__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img(puppy.media, 1080)}
                  alt={`${puppy.name} — ${puppy.meta}`}
                  decoding="async"
                />
              </span>
              {puppy.meta.includes("video") && (
                <span className="tp-sketch__video">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                  Video available on request
                </span>
              )}
            </div>

            <div className="tp-paper">
              <span className="tp-ribbon font-scrawl">
                {imported ? "Imported for you" : "Available in Dubai"}
              </span>
              <h1 id="pup-title" className="tp-title font-plush">
                {puppy.name}
              </h1>
              <p className="mt-2 text-[1.1rem] text-[var(--color-cocoa-soft)]">
                {puppy.meta}
              </p>

              <div className="tp-tags">
                <span className="tp-tag">
                  {imported ? "Europe · Korea → Dubai" : "Downtown Dubai"}
                </span>
                <span className="tp-tag">Health certificate</span>
              </div>

              <p className="mt-5 text-[var(--color-cocoa-soft)]">
                {imported
                  ? `Ready to welcome ${puppy.name} home? We handle the entire import — from reserve to arrival in Dubai — with real photos and updates at every step.`
                  : `Come meet ${puppy.name} in our Downtown Dubai showroom, spend time together, and take your new family member home the same day.`}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={ask}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  Ask about {puppy.name}
                </a>
                <Link href="/contact" className="btn btn-ghost">
                  Visit &amp; contact
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-[clamp(1.5rem,4vw,2.5rem)] lg:grid-cols-2">
            <div className="tp-paper">
              <h2 className="font-plush text-[clamp(1.5rem,3vw,2.1rem)]">
                Every Teddy Pup comes
              </h2>
              <div className="tp-trail">
                {promises.map((text, i) => (
                  <div key={text} className="tp-trail__row">
                    <span className="tp-trail__num">{i + 1}</span>
                    <span className="tp-trail__text">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tp-paper">
              <h2 className="font-plush text-[clamp(1.5rem,3vw,2.1rem)]">
                {imported ? "Coming home from abroad" : "Taking your puppy home"}
              </h2>
              <div className="tp-trail">
                {(imported
                  ? [
                      ["Reserve your puppy", "Confirm your choice and we'll reserve it with the breeder."],
                      ["Personalized consultation", "We walk you through the breed, health and paperwork."],
                      ["Import and arrival", "Safe, stress-free travel with updates until arrival."],
                      ["Welcome home", "Collect in Dubai and get ongoing support from our team."],
                    ]
                  : [
                      ["Explore & choose", "Tell us what you're looking for and we'll guide you."],
                      ["Meet before you choose", "Visit our Downtown Dubai showroom for a real meet-up."],
                      ["Pick-up or delivery", "Take your puppy home the same day, or have us deliver."],
                      ["Ongoing support", "We stay in touch to help with the first weeks at home."],
                    ]
                ).map(([title, text], i) => (
                  <div key={title} className="tp-trail__row">
                    <span className="tp-trail__num">{i + 1}</span>
                    <span>
                      <span className="tp-trail__title">{title}</span>
                      <span className="tp-trail__text block">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tp-gone-strip">
            <div className="tp-head">
              <h2 className="tp-title font-plush text-[clamp(1.6rem,3.5vw,2.4rem)]">
                More puppies waiting
              </h2>
              <Link href="/puppies" className="btn btn-ghost">
                See all available puppies
              </Link>
            </div>
            <ul className="tp-sketches">
              {more.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="tp-sketch">
                    <span className="tp-sketch__frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img(p.media, 384)}
                        alt={`${p.name} — ${p.meta}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="tp-sketch__name font-plush-text">{p.name}</span>
                    <span className="tp-sketch__meta">{p.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}