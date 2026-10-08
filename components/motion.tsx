"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { getLenis, setLenis } from "@/lib/scroll";

/* Reveal curve is Maxwell Wines' cubic-bezier(0.15, 0.75, 0.5, 1) (measured on maxwellwines.com.au). */
export const EASE = "tm";

/* The whole reveal vocabulary (documented in the README). Each move plays once.
   Sections marked data-fast use 75% of the duration, so later sections feel lighter. */
const MOVES: Record<string, { y: number; dur: number }> = {
  heading: { y: 20, dur: 0.95 },
  para: { y: 14, dur: 0.85 },
  label: { y: 8, dur: 0.6 },
};

export function usePageMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create(EASE, "0.15, 0.75, 0.5, 1");
    const root = document.documentElement;
    const reduced = reducedMotion();
    const header = document.querySelector<HTMLElement>(".site-header");
    /* Grounds of the page only: the header carries data-tone itself and must not match its own position. */
    const tones = Array.from(document.querySelectorAll<HTMLElement>("main [data-tone], footer[data-tone]"));
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 1 });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      /* Scrolling stays locked until the loader hands over. */
      if (root.dataset.intro !== "done") lenis.stop();
    }
    const unlock = () => lenis?.start();
    document.addEventListener("intro:done", unlock);

    const ctx = gsap.context(() => {
      if (reduced) return;
      const speed = (el: Element) => (el.closest("[data-fast]") ? 0.75 : 1);
      const once = (el: Element, start: string, run: () => void) => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: run });

      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const kind = el.dataset.reveal ?? "para";
        if (kind === "card") return; /* batched below */
        const m = MOVES[kind] ?? MOVES.para;
        once(el, "top 92%", () => gsap.fromTo(el, { opacity: 0, y: m.y }, { opacity: 1, y: 0, duration: m.dur * speed(el), ease: EASE, clearProps: "transform" }));
      });

      ScrollTrigger.batch('[data-reveal="card"]', {
        start: "top 94%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.85 * speed(batch[0]), stagger: 0.08, ease: EASE, clearProps: "transform" }),
      });

      /* Images: the frame opens (clip) once, and the picture drifts about 10% of its height while it crosses the viewport. */
      document.querySelectorAll<HTMLElement>("[data-image]").forEach((frame) => {
        const img = frame.querySelector("img");
        const k = speed(frame);
        gsap.set(img, { scale: 1.12 });
        once(frame, "top 90%", () => gsap.to(frame, { clipPath: "inset(0 0 0% 0)", duration: 1.15 * k, ease: EASE }));
        if (img) gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });

    /* Header: its colour follows the ground beneath it, and it hides while scrolling down. */
    let last = scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = scrollY;
      if (header) {
        const probe = header.offsetHeight / 2;
        const under = tones.find((t) => { const r = t.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
        header.dataset.tone = under?.dataset.tone ?? "dark";
        const down = y > last + 4;
        const up = y < last - 4;
        if (y < 80 || up) header.dataset.hidden = "false";
        else if (down && !root.classList.contains("menu-open")) header.dataset.hidden = "true";
      }
      if (Math.abs(y - last) > 4) last = y;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    update();

    /* In-page anchors go through Lenis. */
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      const id = link.getAttribute("href") ?? "";
      const target = id === "#top" ? null : document.querySelector<HTMLElement>(id);
      if (id !== "#top" && !target) return;
      event.preventDefault();
      if (lenis) { lenis.start(); lenis.scrollTo(target ?? 0, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), offset: -8 }); }
      else if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    };
    document.addEventListener("click", onClick);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    root.dataset.ready = "1";

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("intro:done", unlock);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(frame);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
}

/* Overlay helper: locks scroll, traps focus, closes on Esc and returns focus to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void) {
  const previous = document.activeElement as HTMLElement | null;
  const oldOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  getLenis()?.stop();
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
  focusable()[0]?.focus();
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      /* The header sits above the menu, so its controls belong to the trap, in DOM order. */
      const items = [...Array.from(document.querySelectorAll<HTMLElement>(".site-header a[href], .site-header button")), ...focusable()];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.body.style.overflow = oldOverflow;
    getLenis()?.start();
    document.removeEventListener("keydown", handleKey);
    previous?.focus();
  };
}
