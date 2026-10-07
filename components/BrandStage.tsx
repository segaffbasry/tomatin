"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { A, Arrow, Rich, reducedMotion } from "@/components/ui";
import { brands } from "@/lib/content";

/* The four brands as one full-bleed stage (after the chapter slider on moncalisse.com): the brand's own photograph fills the
   section behind a centred cream card with a counter, picture, copy and link; the brand names run along the bottom as tabs. */
export function BrandStage() {
  const items = brands.items;
  const [i, setI] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion() || !card.current) return;
    gsap.fromTo(card.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "tm" });
    gsap.fromTo(card.current.querySelectorAll("[data-swap]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, delay: 0.2, ease: "tm" });
  }, [i]);

  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const to = (next + items.length) % items.length;
    setI(to);
    requestAnimationFrame(() => document.getElementById(`brand-tab-${to}`)?.focus());
  };

  const b = items[i];
  return (
    <section id="brands" className="brand-stage" data-tone="dark" data-scene={b.kind} aria-labelledby="brands-title">
      <div className="bs-bg" aria-hidden="true">
        {items.map((t, n) => (
          t.kind === "line"
            ? <span key={t.name} className={`bs-layer bs-layer--line${n === i ? " is-active" : ""}`} style={{ ["--mask" as string]: `url(${t.bg})` }} />
            : <span key={t.name} className={`bs-layer${n === i ? " is-active" : ""}`}><Image src={t.bg} alt="" fill sizes="100vw" /></span>
        ))}
      </div>

      <div className="bs-head wrap">
        <p className="eyebrow" data-reveal="label">{brands.eyebrow}</p>
        <h2 className="statement statement--light" id="brands-title" data-reveal="heading"><Rich text={brands.title} /></h2>
      </div>

      <div className="bs-card" ref={card} role="tabpanel" id="brand-panel" aria-labelledby={`brand-tab-${i}`} data-reveal="card">
        <p className="bs-count" data-swap>{String(i + 1).padStart(2, "0")} <span>/ {String(items.length).padStart(2, "0")}</span></p>
        <h3 className="bs-name" data-swap>{b.name}</h3>
        <div className={`bs-pic${b.kind === "line" ? " bs-pic--line" : ""}`} data-swap>
          {b.kind === "line"
            ? <span className="line-art" role="img" aria-label={b.alt} style={{ ["--mask" as string]: `url(${b.image})` }} />
            : <Image src={b.image} alt={b.alt} fill sizes="(max-width: 620px) 80vw, 380px" />}
        </div>
        <p className="bs-tag" data-swap>{b.tag}</p>
        <p className="bs-text" data-swap>{b.text}</p>
        <A href={b.href} className="link-arrow" label={`Discover ${b.name}`}><span>Discover {b.name}</span><Arrow /></A>
      </div>

      <div className="bs-tabs" role="tablist" aria-label="Our brands" onKeyDown={onKey}>
        {items.map((t, n) => (
          <button key={t.name} id={`brand-tab-${n}`} type="button" role="tab" aria-selected={n === i} aria-controls="brand-panel" tabIndex={n === i ? 0 : -1} onClick={() => setI(n)}>{t.name}</button>
        ))}
      </div>
    </section>
  );
}
