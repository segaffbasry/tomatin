"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Rich } from "@/components/ui";
import { timeline } from "@/lib/content";
import { getLenis } from "@/lib/scroll";

/* Each photograph sits at its own slight angle, like prints laid on a table (after the tilted chapter cards on imperialebolgheri.com). */
const TILT = [-4, 3.5, -2.5, 4, -3.5, 2.5];
/* Scroll distance per chapter while pinned, as a share of the viewport height. */
const STEP = 0.5;

/* Our history as a deck of prints. On desktop the section pins and scrolling deals the next print up over the last
   (scrubbed, snapping to each year); the year rolls over in large type and the copy beside it changes.
   On small screens and with reduced motion nothing pins: swipe, the arrows or the years move the deck instead. */
export function Chapters() {
  const items = timeline.items;
  const n = items.length;
  const section = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLParagraphElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const goRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const el = section.current, d = deck.current;
    if (!el || !d) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = Array.from(d.querySelectorAll<HTMLElement>(".ch-card"));
    const imgs = cards.map((c) => c.querySelector<HTMLElement>(".ch-img"));

    /* Places every print for a continuous position p (0 = first year, n - 1 = last). */
    const render = (p: number) => {
      const vh = window.innerHeight;
      cards.forEach((c, i) => {
        const off = i - p;
        let y: number, r: number, s: number, dim: number, zoom: number, alpha = 1;
        if (off >= 1) { y = vh * 1.1; r = TILT[i] + 12; s = 1; dim = 0; zoom = 1.25; alpha = 0; }
        else if (off > 0) { y = off * vh * 1.1; r = TILT[i] + off * 12; s = 1; dim = 0; zoom = 1 + off * 0.25; }
        else if (off > -1) { y = off * vh * 0.08; r = TILT[i] + off * 3; s = 1 + off * 0.08; dim = -off * 0.55; zoom = 1; }
        else { y = -vh * 0.08; r = TILT[i] - 3; s = 0.92; dim = 0.55; zoom = 1; alpha = Math.max(0, 1 + (off + 1) * 1.2); }
        gsap.set(c, { y, rotation: r, scale: s, opacity: alpha, "--dim": dim });
        if (imgs[i]) gsap.set(imgs[i], { scale: zoom });
      });
      if (bar.current) gsap.set(bar.current, { scaleX: n > 1 ? p / (n - 1) : 1 });
      const a = Math.min(n - 1, Math.max(0, Math.round(p)));
      if (a !== activeRef.current) { activeRef.current = a; setActive(a); }
    };

    const state = { p: 0 };
    render(0);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${(n - 1) * window.innerHeight * STEP}`,
        pin: true,
        scrub: 0.6,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.7 }, delay: 0.06, ease: "power2.inOut" },
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress * (n - 1)),
      });
      goRef.current = (i: number) => {
        const target = st.start + (st.end - st.start) * (Math.min(n - 1, Math.max(0, i)) / (n - 1));
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(target, { duration: 1.2 }); else window.scrollTo(0, target);
      };
      return () => st.kill();
    });

    mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      goRef.current = (i: number) => {
        const to = (i + n) % n;
        if (reduced) { state.p = to; render(to); return; }
        gsap.to(state, { p: to, duration: 0.9, ease: "power3.inOut", overwrite: true, onUpdate: () => render(state.p) });
      };
      /* Swipe on the deck. */
      let x0 = 0;
      const down = (e: PointerEvent) => { x0 = e.clientX; };
      const up = (e: PointerEvent) => { const dx = e.clientX - x0; if (Math.abs(dx) > 40) goRef.current(activeRef.current + (dx < 0 ? 1 : -1)); };
      d.addEventListener("pointerdown", down);
      d.addEventListener("pointerup", up);
      return () => { d.removeEventListener("pointerdown", down); d.removeEventListener("pointerup", up); gsap.killTweensOf(state); };
    });

    return () => mm.revert();
  }, [n]);

  /* The year rolls over digit by digit; the copy rises in. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (year.current) gsap.fromTo(year.current.querySelectorAll(".ch-dg > span"), { yPercent: 105 }, { yPercent: 0, duration: 0.75, stagger: 0.06, ease: "tm" });
    if (copy.current) gsap.fromTo(copy.current.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "tm" });
  }, [active]);

  const it = items[active];
  return (
    <section ref={section} id="history" className="chapters" data-tone="dark" aria-labelledby="history-title">
      <div className="ch-stage">
        <div className="ch-top">
          <div>
            <p className="eyebrow">{timeline.eyebrow}</p>
            <h2 className="ch-title" id="history-title"><Rich text={timeline.title} /></h2>
          </div>
          <p className="ch-count" aria-hidden="true"><span>{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}</p>
        </div>

        <nav className="ch-index" aria-label="Choose a year">
          {items.map((t, i) => (
            <button key={t.year} type="button" aria-current={i === active ? "step" : undefined} onClick={() => goRef.current(i)}>
              <span>{t.year}</span><span className="ch-index-title">{t.title.replace(/\.$/, "")}</span>
            </button>
          ))}
        </nav>

        <div className="ch-deck" ref={deck}>
          {items.map((t, i) => (
            <figure key={t.year} className={`ch-card${"fit" in t ? " ch-card--whole" : ""}`} style={{ zIndex: i + 1, ["--ar" as string]: `${t.w} / ${t.h}` }} aria-hidden={i === active ? undefined : true}>
              <div className="ch-frame"><div className="ch-img"><Image src={t.image} alt={i === active ? t.alt : ""} fill sizes="(max-width: 900px) 80vw, 44vw" /></div></div>
              <figcaption>{t.year} · {t.title.replace(/\.$/, "")}</figcaption>
            </figure>
          ))}
        </div>

        <p className="ch-year" ref={year} aria-hidden="true">
          {it.year.split("").map((d, k) => <span className="ch-dg" key={k}><span key={`${it.year}-${k}`}>{d}</span></span>)}
        </p>

        <div className="ch-copy" ref={copy} aria-live="polite">
          <h3 className="h3">{it.title}</h3>
          <p>{it.text}</p>
        </div>

        <div className="ch-ctrl">
          <button type="button" className="round round--light" onClick={() => goRef.current(active - 1)} aria-label="Previous year"><Arrow /></button>
          <button type="button" className="round round--light" onClick={() => goRef.current(active + 1)} aria-label="Next year"><Arrow /></button>
        </div>
        <span className="ch-bar" aria-hidden="true"><span ref={bar} /></span>
      </div>
    </section>
  );
}
