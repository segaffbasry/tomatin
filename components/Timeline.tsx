"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Rich, reducedMotion } from "@/components/ui";
import { timeline } from "@/lib/content";

/* Interactive history: pick a year (click, arrows or the keyboard) and the photograph cross-fades while the copy rises in. */
export function Timeline() {
  const [i, setI] = useState(0);
  const copy = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const items = timeline.items;
  const go = (n: number) => setI((n + items.length) % items.length);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion() || !copy.current) return;
    gsap.fromTo(copy.current.querySelectorAll("[data-swap]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "tm", clearProps: "transform" });
  }, [i]);

  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    requestAnimationFrame(() => document.getElementById(`tab-${(next + items.length) % items.length}`)?.focus());
  };

  const it = items[i];
  return (
    <section id="history" className="section tone-cream" data-tone="light" aria-labelledby="history-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-reveal="label">{timeline.eyebrow}</p>
            <h2 className="h2" id="history-title" data-reveal="heading"><Rich text={timeline.title} /></h2>
          </div>
        </div>
        <div className="tl-rail" role="tablist" aria-label="Tomatin through the years" onKeyDown={onKey} data-reveal="label">
          {items.map((t, n) => (
            <button key={t.year} id={`tab-${n}`} type="button" role="tab" aria-selected={n === i} aria-controls="tl-panel" tabIndex={n === i ? 0 : -1} className="tl-tab" onClick={() => setI(n)}>{t.year}</button>
          ))}
        </div>
        <div className="tl-panel" id="tl-panel" role="tabpanel" aria-labelledby={`tab-${i}`}>
          <div className="tl-media" data-reveal="card">
            {items.map((t, n) => (
              <Image key={t.year} src={t.image} alt={n === i ? t.alt : ""} fill sizes="(max-width: 900px) 92vw, 52vw" className={n === i ? "is-active" : ""} aria-hidden={n === i ? undefined : true} />
            ))}
          </div>
          <div className="tl-copy" ref={copy} aria-live="polite">
            <p className="tl-year" data-swap>{it.year}</p>
            <h3 className="h3" data-swap>{it.title}</h3>
            <p data-swap>{it.text}</p>
            <div className="tl-ctrl" data-swap>
              <button type="button" className="round" onClick={() => go(i - 1)} aria-label="Previous year"><Arrow /></button>
              <span className="tl-count">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
              <button type="button" className="round" onClick={() => go(i + 1)} aria-label="Next year"><Arrow /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
