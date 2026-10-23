import { ADDRESS, CDN, EMAIL, navLinks, SLOGAN, socials, TELEPHONE, WHATSAPP } from "@/lib/data";
import { WhatsApp } from "./icons";

export default function SiteFooter() {
  return (
    <footer className="tp-footer relative">
      <svg
        className="tp-footer__edge"
        width="100%"
        height="46"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="tp-footer-cloud"
            width="96"
            height="46"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 46V32A48 30 0 0 1 96 32V46Z"
              className="tp-footer__cloud-fill"
            />
            <path d="M0 32A48 30 0 0 1 96 32" className="tp-footer__cloud-line" />
          </pattern>
        </defs>
        <rect width="100%" height="46" fill="url(#tp-footer-cloud)" />
      </svg>

      <div className="gutter relative mx-auto max-w-[110rem] pt-[clamp(3rem,7vh,5rem)]">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex flex-col">
            <h2 className="font-plush text-[clamp(2.4rem,5vw,4rem)]">
              Home, at last.
            </h2>
            <p className="mt-4 max-w-[42ch] text-milk/70">
              TeddyPups U.A.E. is a Dubai-based brand specializing in miniature
              puppies, offering premium services and worldwide shipping.
            </p>

            {/* Teddy's basket, waiting at the bottom of the footer. */}
            <div className="tp-basket mt-10 md:mt-auto md:pt-10" aria-hidden="true">
              <svg viewBox="0 0 300 240" className="tp-basket__back">
                <ellipse
                  cx="212"
                  cy="145"
                  rx="96"
                  ry="12"
                  className="tp-basket__hollow"
                />
                <path
                  d="M116 145 A96 12 0 0 1 308 145"
                  className="tp-basket__rim-line"
                />
                <path
                  d="M116 145 A96 12 0 0 1 308 145"
                  className="tp-basket__rim"
                />
              </svg>
              <svg viewBox="0 0 300 240" className="tp-basket__front">
                <path
                  d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z"
                  className="tp-basket__body"
                />
                <path
                  d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206"
                  className="tp-basket__weave"
                />
                <path
                  d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230"
                  className="tp-basket__weave tp-basket__weave--stakes"
                />
                <path
                  d="M116 145 A96 12 0 0 0 308 145"
                  className="tp-basket__rim-line"
                />
                <path
                  d="M116 145 A96 12 0 0 0 308 145"
                  className="tp-basket__rim"
                />
              </svg>
            </div>
          </div>

          <div>
            <h3 className="font-scrawl text-xl text-honey">Say hello</h3>
            <ul className="mt-4 grid gap-3 text-milk/80">
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-honey"
                >
                  <WhatsApp className="size-5" />
                  WhatsApp {TELEPHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 hover:text-honey"
                >
                  {EMAIL}
                </a>
              </li>
              <li>{ADDRESS}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-scrawl text-xl text-honey">Explore</h3>
            <ul className="mt-4 grid gap-2 text-milk/80">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-honey">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-4 text-milk/80">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-honey"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
          <span className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${CDN}/_next/image?url=%2Fbrand%2Flogo.png&w=96&q=75`}
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain"
              loading="lazy"
            />
            © 2026 TeddyPups U.A.E.
          </span>
          <span className="font-scrawl text-base text-honey/80">{SLOGAN}</span>
        </div>
      </div>
    </footer>
  );
}