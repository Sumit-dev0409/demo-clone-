"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { availablePuppies, img } from "@/lib/data";
import { PAW_PATH } from "@/lib/pup-art";

const skyVars = {
  "--sky-top": "#fff1d8",
  "--sky-bottom": "#fbe3b4",
} as React.CSSProperties;

export default function MeetThePups() {
  const pinRef = useRef<HTMLDivElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [maxTravel, setMaxTravel] = useState(0);

  // Measure the pinned stage: size the doors and work out how far the track travels.
  useEffect(() => {
    const measure = () => {
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nextPinned = desktop && !still;
      setPinned(nextPinned);

      const track = trackRef.current;
      const hall = hallRef.current;
      if (track && hall && nextPinned) {
        const stage = hall.parentElement;
        const head = stage?.querySelector(".tp-meet__head") as HTMLElement | null;
        const plateH = Math.max(
          64,
          ...Array.from(track.querySelectorAll(".tp-door__plate")).map(
            (el) => (el as HTMLElement).offsetHeight,
          ),
        );
        const floorH =
          (hall.querySelector(".tp-meet__floor") as HTMLElement | null)?.offsetHeight ?? 0;
        const doorW = Math.max(
          128,
          Math.min(
            256,
            0.15 * window.innerWidth,
            (stage!.clientHeight -
              (head ? head.offsetTop + head.offsetHeight : 0) -
              floorH -
              plateH -
              40) /
              1.3,
          ),
        );
        track.style.setProperty("--door-w", `${doorW.toFixed(0)}px`);
      } else {
        track?.style.removeProperty("--door-w");
      }
      setMaxTravel(track ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (hallRef.current?.parentElement) observer.observe(hallRef.current.parentElement);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Normal scrolling drives the "treadmill": the track slides right→left and each
  // door swings open as it crosses the left third of the viewport.
  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    const pin = pinRef.current;
    const hall = hallRef.current;
    if (!track || !pin) return;

    let target = 0;
    let current = 0;
    let raf = 0;

    const apply = () => {
      const gap = target - current;
      current += gap * 0.18;
      if (Math.abs(gap) < 0.3) current = target;
      track.style.transform = `translate3d(${current.toFixed(1)}px, 0, 0)`;
      hall?.style.setProperty("--floor-x", `${current.toFixed(1)}px`);
      const threshold = 0.36 * window.innerWidth;
      for (const node of Array.from(track.children)) {
        const el = node as HTMLElement;
        const next = String(el.offsetLeft + current < threshold);
        if (el.dataset.open !== next) el.dataset.open = next;
      }
    };

    const tick = () => {
      raf = 0;
      const span = pin.offsetHeight - window.innerHeight;
      const progress =
        span > 0 ? Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / span)) : 0;
      target = -maxTravel * progress;
      apply();
      if (Math.abs(target - current) > 0.5) schedule();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      track.style.transform = "";
      hall?.style.removeProperty("--floor-x");
    };
  }, [pinned, maxTravel]);

  return (
    <section
      id="meet"
      className="tp-scene tp-meet"
      data-tone="light"
      data-pinned={pinned ? "" : undefined}
      style={skyVars}
      aria-labelledby="meet-title"
    >
      <div
        ref={pinRef}
        style={pinned ? { height: `calc(100vh + ${Math.round(0.8 * maxTravel)}px)` } : undefined}
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <p className="tp-kicker font-scrawl">meet the pups</p>
              <h2 id="meet-title" className="tp-title font-plush mt-1">
                Meet the pups
              </h2>
              <p className="mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                Real puppies, real photos, looking for their families right now.
              </p>
            </div>
            <Link href="/puppies" className="btn btn-primary shrink-0">
              See all available puppies
            </Link>
          </header>

          <div ref={hallRef} className="tp-meet__hall">
            <ol
              ref={trackRef}
              className="tp-meet__track"
              aria-label="Puppies looking for a family"
            >
              {availablePuppies.map((p) => (
                <li key={p.href} className="tp-door" data-open={pinned ? "false" : "true"}>
                  <Link
                    href={p.href}
                    className="tp-door__link"
                    style={{ "--door": p.door } as React.CSSProperties}
                  >
                    <span className="tp-door__plate">
                      <span className="tp-door__name font-plush">{p.name}</span>
                      <span className="tp-door__meta">{p.meta}</span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img(p.media, 384)}
                          alt={`${p.name} puppy`}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="tp-door__way" aria-hidden="true">
                        <span className="tp-door__leaf">
                          <svg
                            viewBox="0 0 64 64"
                            className="tp-door__peephole"
                            aria-hidden="true"
                            fill="currentColor"
                          >
                            <path d={PAW_PATH} />
                          </svg>
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">Available</span>
                    </span>
                  </Link>
                </li>
              ))}

              <li className="tp-door tp-door--all" data-open="true">
                <Link href="/puppies" className="tp-door__link">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="tp-door__all font-plush">Meet them all</span>
                  </span>
                </Link>
              </li>
            </ol>

            <div aria-hidden="true" className="tp-meet__floor" />
          </div>
        </div>
      </div>
    </section>
  );
}