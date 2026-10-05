"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Rich, reducedMotion } from "@/components/ui";
import { timeline } from "@/lib/content";

const AUTO_MS = 7000;

/* Interactive history. A vertical year rail on the left, one large photograph on the right with the year set over it, and the copy on a card
   that overlaps the photograph. It advances on its own (a progress line fills the active year) until the visitor takes over. */
export function Timeline() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const items = timeline.items;
  const go = (n: number) => setI((n + items.length) % items.length);
  const take = (n: number) => { setAuto(false); go(n); };

  /* Autoplay only while the section is on screen, only for people who have not asked for reduced motion, and never after they take over. */
  useEffect(() => {
    setAuto(!reducedMotion());
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !inView) return;
    const t = window.setTimeout(() => go(i + 1), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [i, auto, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion() || !copy.current) return;
    gsap.fromTo(copy.current.querySelectorAll("[data-swap]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "tm", clearProps: "transform" });
  }, [i]);

  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    take(next);
    requestAnimationFrame(() => document.getElementById(`tab-${(next + items.length) % items.length}`)?.focus());
  };

  const it = items[i];
  return (
    <section ref={section} id="history" className="section tone-cream" data-tone="light" aria-labelledby="history-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-reveal="label">{timeline.eyebrow}</p>
            <h2 className="h2" id="history-title" data-reveal="heading"><Rich text={timeline.title} /></h2>
          </div>
        </div>
        <div className="tl-stage">
          <div className="tl-rail" role="tablist" aria-label="Tomatin through the years" aria-orientation="vertical" onKeyDown={onKey} data-reveal="label">
            {items.map((t, n) => (
              <button key={t.year} id={`tab-${n}`} type="button" role="tab" aria-selected={n === i} aria-controls="tl-panel" tabIndex={n === i ? 0 : -1} className="tl-tab" data-auto={auto && inView} onClick={() => take(n)}>
                <span className="tl-tab-year">{t.year}</span>
                <span className="tl-tab-title">{t.title.replace(/\.$/, "")}</span>
              </button>
            ))}
          </div>
          <div className="tl-visual" id="tl-panel" role="tabpanel" aria-labelledby={`tab-${i}`} data-reveal="card">
            <div className="tl-media">
              {items.map((t, n) => (
                <Image key={t.year} src={t.image} alt={n === i ? t.alt : ""} fill sizes="(max-width: 900px) 92vw, 62vw" className={`${n === i ? "is-active" : ""}${"fit" in t && t.fit === "contain" ? " is-contain" : ""}`} aria-hidden={n === i ? undefined : true} />
              ))}
              <p className="tl-big" aria-hidden="true">{it.year}</p>
            </div>
            <div className="tl-card" ref={copy} aria-live="polite">
              <h3 className="h3" data-swap>{it.title}</h3>
              <p data-swap>{it.text}</p>
              <div className="tl-ctrl" data-swap>
                <button type="button" className="round" onClick={() => take(i - 1)} aria-label="Previous year"><Arrow /></button>
                <span className="tl-count">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                <button type="button" className="round" onClick={() => take(i + 1)} aria-label="Next year"><Arrow /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
