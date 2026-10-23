import { breeds, CDN, WHATSAPP } from "@/lib/data";
import { WhatsApp } from "./icons";

export default function WhatsAppCard() {
  return (
    <div className="tp-chatcard">
      <div className="tp-chatcard__bar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${CDN}/_next/image?url=%2Fbrand%2Flogo.png&w=96&q=75`}
          alt=""
          className="size-11 rounded-full bg-milk object-contain p-1"
        />
        <div className="leading-tight">
          <p className="font-plush text-xl">TeddyPups U.A.E.</p>
          <p className="text-sm text-white/85">online</p>
        </div>
        <WhatsApp className="ml-auto size-6" />
      </div>

      <div className="tp-chatcard__body">
        <p className="tp-bubble tp-bubble--me">
          Hi TeddyPups! I&apos;d love to know more about your puppies.
        </p>

        <div className="tp-bubble tp-bubble--them">
          <p>
            Select your preferred breed or tell us what you&apos;re looking
            for. We&apos;ll guide you based on availability and your lifestyle.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {breeds.map((b) => (
              <a key={b.href} href={b.href} className="tp-chip">
                {b.label}
              </a>
            ))}
          </div>
        </div>

        <p className="tp-bubble tp-bubble--them">
          Our team will share real photos, health details, and all necessary
          information directly on WhatsApp.
        </p>

        <p className="tp-bubble tp-bubble--them">
          Once confirmed, we handle everything professionally and ensure your
          puppy reaches you safely and stress-free.
        </p>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp mt-1 justify-self-start"
        >
          <WhatsApp className="size-5" />
          Say hello on WhatsApp
        </a>
      </div>
    </div>
  );
}