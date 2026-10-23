"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CDN, navLinks, WHATSAPP, SLOGAN } from "@/lib/data";
import { Paw, WhatsApp } from "./icons";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 260 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The milk backdrop (and its cloud hem) only shows over the page on scroll,
  // on an open menu, or anywhere that isn't the pale home hero.
  const solid = scrolled || open || pathname !== "/";

  return (
    <header
      className="tp-header sticky top-0 z-50 transition-transform duration-500"
      style={{ transform: hidden && !open ? "translateY(-120%)" : "none" }}
    >
      <div
        className={`absolute inset-0 bg-milk transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      <svg
        aria-hidden="true"
        className={`tp-header__hem transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
        width="100%"
        height="14"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
      <div className="gutter relative mx-auto flex h-[var(--header-h)] max-w-[110rem] items-center gap-4">
        <Link
          href="/"
          className="tp-header__brand flex flex-none items-center gap-3 rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${CDN}/_next/image?url=%2Fbrand%2Flogo.png&w=96&q=75`}
            alt="TeddyPups"
            width={48}
            height={48}
            className="tp-header__logo size-10 rounded-full object-contain transition-transform duration-500 md:size-12"
          />
          <span className="font-plush text-2xl leading-none">TeddyPups</span>
        </Link>

        <nav className="tp-header__nav hidden flex-1 justify-center lg:flex" aria-label="Main">
          <ul className="flex items-center gap-[clamp(1.25rem,2.3vw,2.4rem)]">
            {navLinks.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="tp-nav-link relative inline-flex items-center whitespace-nowrap px-0.5 py-2 font-semibold transition-colors hover:text-toffee-ink data-[active=true]:text-toffee-deep"
                    data-active={active}
                    aria-current={active ? "page" : undefined}
                  >
                    {l.label}
                    <Paw
                      className={`absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 -rotate-[10deg] text-toffee transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center justify-center gap-2 rounded-full bg-[#1f7a4d] px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-[0_0.4rem_0_-0.15rem_var(--color-cocoa)] transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            <WhatsApp className="size-4" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border-2 border-cocoa lg:hidden"
          >
            <span className="grid gap-1">
              <span className="block h-0.5 w-5 bg-cocoa" />
              <span className="block h-0.5 w-5 bg-cocoa" />
              <span className="block h-0.5 w-5 bg-cocoa" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="gutter relative border-t-2 border-cocoa bg-milk pb-6 pt-2 lg:hidden">
          <p className="font-scrawl py-2 text-toffee-ink">{SLOGAN}</p>
          <ul className="grid gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-xl px-3 py-3 text-lg font-semibold hover:bg-honey-soft"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}