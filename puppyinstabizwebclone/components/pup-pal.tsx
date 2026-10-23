"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PAW_PATH, PUP_RUNNER_ART } from "@/lib/pup-art";

const PRINT_COUNT = 14;
const PRINT_LIFE = 1500; // ms a paw print lingers before fading out
const STEP = 30; // px of travel between two paw prints
// Pixels of scrolling per full left-right crossing. A fixed distance — rather
// than a share of the page — keeps the pup at the same pace on a short page
// and a long one.
const SWEEP_PX = 1800;
const BUBBLE_HINT = "wanna meet my friends?";
// How far the pupils drift inside the eyes, in the runner's 300x240 viewBox.
const EYE_REACH_X = 3.4;
const EYE_REACH_Y = 2.4;
// Pixels of scrolling before the pup hops out of its perch among the hero photos.
const PERCH_RELEASE = 60;
// How long after the last mouse move the pup keeps trotting at the cursor.
const MOUSE_RUN_WINDOW = 220;
// Instep "scuff" per frame while the pup runs in place at the cursor.
const SCUFF = 2;
// The basket's hollow, in its own 300x240 viewBox — where the pup sits at home.
const BASKET_CX = 212;
const BASKET_FLOOR = 185;

// A triangle wave — the zigzag path the puppy walks while you scroll.
function zigzag(distance: number) {
  const f = distance - Math.floor(distance);
  const ascending = f < 0.5;
  return { value: ascending ? f * 2 : 2 - f * 2, ascending };
}

export default function PupPal() {
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const printRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleGone, setBubbleGone] = useState(false);

  // The hint bubble shows up on its own, then leaves for good the moment the
  // visitor mouses over the puppy.
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const actor = actorRef.current;
    const body = bodyRef.current;
    const layer = layerRef.current;
    if (!actor || !body || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const prints = printRefs.current;
    const births = new Array<number>(prints.length).fill(-Infinity);
    let write = 0;
    let stepSide = 1;

    // Cached layout metrics — refreshed on resize instead of every frame.
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let bodyW = 0;
    let bodyH = 0;
    let bottomPad = 24;
    let startY = 0; // where the pup sets off from on the home page
    let restY = 0; // where it settles: the floor of the screen
    let lineupEl: HTMLElement | null = null; // the six hero photos
    let quiltEl: HTMLElement | null = null; // the quilt hem they stand in
    let basket: HTMLElement | null = null; // the pup's home, bottom of the footer
    let chatCard: HTMLElement | null = null; // the WhatsApp chat it parks beside
    let ctaEl: HTMLElement | null = null; // the "How it works" step
    let parkAmt = 0; // 0 = travelling, 1 = settled at the chat / in the basket
    let perchAmt = 0; // 0 = out running, 1 = tucked among the hero photos
    let perchX = 0; // where the perch sits, in viewport coordinates
    let perchY = 0;
    let lastHome = false; // true while the pup sits behind the scene art
    let lastPerch = false;

    // The pup's perch: the middle of the six hero photo seats, standing just
    // behind the quilt hem so only his top half shows.
    const readPerch = () => {
      if (!lineupEl || !quiltEl) return false;
      const line = lineupEl.getBoundingClientRect();
      const quilt = quiltEl.getBoundingClientRect();
      perchX = line.left + line.width * 0.5 - bodyW * 0.5;
      perchY = quilt.top - bodyH * 0.6;
      return true;
    };

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      bodyW = body.offsetWidth;
      bodyH = body.offsetHeight;
      bottomPad = vw < 768 ? 76 : 24;
      restY = vh - bodyH - bottomPad;

      lineupEl = document.querySelector<HTMLElement>(".tp-lineup");
      quiltEl = document.querySelector<HTMLElement>(".tp-quilt");
      basket = document.querySelector<HTMLElement>(".tp-basket");
      chatCard = document.querySelector<HTMLElement>(".tp-chatcard");
      ctaEl = document.getElementById("journey-cta");

      // On the home page the pup sets off from the middle of the six hero
      // photos, then runs down to the floor of the screen as you scroll.
      const rect = lineupEl?.getBoundingClientRect();
      const heroMiddle = rect
        ? window.scrollY + rect.top + rect.height * 0.6 - bodyH * 0.5
        : restY;
      startY = Math.max(0, Math.min(restY, heroMiddle));

      if (readPerch() && window.scrollY < PERCH_RELEASE) perchAmt = 1;
    };
    measure();

    let pointerX = -1;
    let pointerY = -1;
    let pointerAt = -Infinity; // when the pointer last moved
    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerAt = performance.now();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let lastX: number | null = null;
    let lastY: number | null = null;
    let travelled = 0;
    let running = false;
    let facing = "right";
    let runUntil = 0;
    let raf = 0;
    let eyes: SVGGElement | null = null;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!bodyW || !bodyH) return;

      const { value, ascending } = zigzag(window.scrollY / SWEEP_PX);

      const pad = Math.max(16, vw * 0.05);
      const usable = Math.max(0, vw - pad * 2 - bodyW);
      const baseX = pad + value * usable;

      // Slide down from the hero photo line to the bottom of the screen over
      // roughly the first screenful of scrolling.
      const settle = Math.min(1, window.scrollY / Math.max(1, vh * 1.1));
      const baseY = startY + (restY - startY) * settle;

      // At the very top the pup rests in the middle of the six hero photos,
      // tucked half behind the quilt hem. The moment you scroll he hops out.
      const shouldPerch =
        window.scrollY < PERCH_RELEASE && (perchAmt > 0.002 || readPerch());
      perchAmt += ((shouldPerch ? 1 : 0) - perchAmt) * 0.12;
      if (perchAmt < 0.002) perchAmt = 0;
      else if (perchAmt > 0.998) perchAmt = 1;

      let x = baseX;
      let y = baseY;
      if (perchAmt > 0) {
        x += (perchX - x) * perchAmt;
        y += (perchY - y) * perchAmt;
      }

      // Once the "How it works" step scrolls into view, the pup stops
      // criss-crossing and stands at the bottom-left of the WhatsApp chat.
      // At the very end of the page it climbs into its basket instead.
      let parkX = 0;
      let parkY = 0;
      let parked = false;
      let inBasket = false;
      if (basket) {
        const b = basket.getBoundingClientRect();
        if (b.top < vh * 0.98 && b.bottom > vh * 0.08) {
          parked = true;
          inBasket = true;
          parkX = b.left + (BASKET_CX / 300) * b.width - bodyW * 0.5;
          parkY = b.top + (BASKET_FLOOR / 240) * b.height - bodyH;
        }
      }
      if (!parked && chatCard && ctaEl) {
        const chat = chatCard.getBoundingClientRect();
        const cta = ctaEl.getBoundingClientRect();
        const gap = Math.max(10, vw * 0.012);
        const targetX = chat.left - bodyW - gap;
        const ctaOnScreen = cta.top < vh * 0.92 && cta.bottom > vh * 0.05;
        const chatOnScreen = chat.top < vh && chat.bottom > vh * 0.25;
        if (ctaOnScreen && chatOnScreen && targetX > Math.max(12, vw * 0.03)) {
          parked = true;
          parkX = targetX;
          // Sit at the chat's bottom edge, but never below the floor of screen.
          parkY = Math.max(0, Math.min(chat.bottom - bodyH - 2, restY));
        }
      }

      parkAmt += ((parked ? 1 : 0) - parkAmt) * 0.09;
      if (parkAmt < 0.002) parkAmt = 0;
      else if (parkAmt > 0.998) parkAmt = 1;

      if (parkAmt > 0) {
        x += (parkX - x) * parkAmt;
        y += (parkY - y) * parkAmt;
      }

      actor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      actor.style.opacity = "1";

      // Perched among the hero photos, or home in the basket, the pup drops
      // behind the scene art instead of running in front of it.
      const perched = perchAmt > 0.5;
      const home = perched || inBasket;
      if (home !== lastHome) {
        lastHome = home;
        if (home) layer.dataset.front = "false";
        else delete layer.dataset.front;
      }
      if (perched !== lastPerch) {
        lastPerch = perched;
        if (perched) document.documentElement.dataset.pupPerch = "true";
        else delete document.documentElement.dataset.pupPerch;
      }

      if (lastX !== null) travelled += Math.abs(x - lastX);

      const moved =
        lastX === null || lastY === null
          ? 0
          : Math.abs(x - lastX) + Math.abs(y - lastY);
      if (moved > 0.4) runUntil = now + 140;

      // If the visitor is moving the mouse, the pup turns towards the cursor
      // and trots in place; a moment after the mouse stops it goes back to its
      // scroll-driven zigzag.
      const mouseActive =
        !parked && pointerX >= 0 && now - pointerAt < MOUSE_RUN_WINDOW;
      // A small dead zone either side of the pup keeps its facing from
      // flickering while the cursor sits right on top of it.
      const midX = x + bodyW * 0.5;
      const toward =
        pointerX > midX + 24 ? "right" : pointerX < midX - 24 ? "left" : facing;

      const nextFacing = parked ? "right" : mouseActive ? toward : ascending ? "right" : "left";
      if (nextFacing !== facing) {
        facing = nextFacing;
        actor.dataset.facing = facing;
      }

      const nextRunning = now < runUntil || mouseActive;
      if (nextRunning !== running) {
        running = nextRunning;
        actor.dataset.running = running ? "true" : "false";
      }
      if (mouseActive && travelled < STEP) travelled += SCUFF;

      // Eyes look towards the pointer. The body is mirrored when the pup
      // faces left, so the horizontal drift flips with it.
      if (!eyes) eyes = body.querySelector<SVGGElement>(".tp-runner__eyes");
      if (eyes && pointerX >= 0) {
        const headFrac = facing === "right" ? 212 / 300 : 1 - 212 / 300;
        const headX = x + headFrac * bodyW;
        const headY = y + (98 / 240) * bodyH;
        const reach = Math.max(140, vw * 0.22);
        const gazeX = Math.max(-1, Math.min(1, (pointerX - headX) / reach));
        const gazeY = Math.max(-1, Math.min(1, (pointerY - headY) / reach));
        const mirror = facing === "right" ? 1 : -1;
        eyes.style.transform = `translate(${(gazeX * EYE_REACH_X * mirror).toFixed(2)}px, ${(
          gazeY * EYE_REACH_Y
        ).toFixed(2)}px)`;
      }

      if (running && travelled >= STEP) {
        travelled = 0;
        stepSide *= -1;
        const slot = write % prints.length;
        births[slot] = now;
        write += 1;
        const el = prints[slot];
        if (el) {
          const dir = facing === "right" ? 1 : -1;
          // Alternate the front and back paws so the trail reads as real steps.
          const px = x + bodyW * 0.3 + stepSide * dir * bodyW * 0.14;
          const py = y + bodyH * 0.86;
          el.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${stepSide * dir * 16}deg)`;
        }
      }
      if (!running) travelled = 0;

      for (let i = 0; i < prints.length; i += 1) {
        const el = prints[i];
        if (!el) continue;
        const age = now - births[i];
        el.style.opacity =
          age < PRINT_LIFE ? String(Math.max(0, 1 - age / PRINT_LIFE) * 0.85) : "0";
      }

      lastX = x;
      lastY = y;
    };

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      delete document.documentElement.dataset.pupPerch;
    };
  }, [pathname]);

  return (
    <div className="pup-layer" ref={layerRef} aria-hidden="true">
      <div className="pup-prints">
        {Array.from({ length: PRINT_COUNT }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 64 64"
            ref={(el) => {
              printRefs.current[i] = el;
            }}
          >
            <path d={PAW_PATH} />
          </svg>
        ))}
      </div>
      <div
        className="pup-actor"
        ref={actorRef}
        data-facing="right"
        data-running="false"
        style={{ opacity: 0 }}
      >
        <span className="pup-bubble-at">
          <span className="pup-bubble" data-show={showBubble && !bubbleGone}>
            {BUBBLE_HINT}
          </span>
        </span>
        <div
          className="pup-actor__body"
          ref={bodyRef}
          onMouseEnter={() => setBubbleGone(true)}
          dangerouslySetInnerHTML={{ __html: PUP_RUNNER_ART }}
        />
      </div>
    </div>
  );
}