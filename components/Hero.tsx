"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Rich, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";

const SLIDE_MS = 7000;

/* A small caption in the frame's corner with the conditions at the distillery right now (Open-Meteo, no key, no visitor data). */
function Conditions() {
  const [temp, setTemp] = useState<number | null>(null);
  const [time, setTime] = useState("");
  useEffect(() => {
    const { lat, lon } = hero.place;
    const ctrl = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=Europe%2FLondon`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { const t = d?.current?.temperature_2m; if (typeof t === "number") setTemp(t); })
      .catch(() => {});
    const clock = () => setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(new Date()));
    clock();
    const id = window.setInterval(clock, 30000);
    return () => { ctrl.abort(); window.clearInterval(id); };
  }, []);
  return <p className="cover-now">{hero.place.name}{temp !== null && <span>{temp.toFixed(1)}°C</span>}<span>{time}</span></p>;
}

/* The cover, after the hero on themacallan.com: restraint rather than spectacle. A framed picture on cream under a centred logo,
   four chapters that change on their own (the brand film first), a small label, a quiet serif title and one action,
   numbered indicators whose line fills while a chapter is showing. It stops advancing once a visitor picks a chapter,
   and never advances with reduced motion. The entrance starts on `intro:done`. */
export function Hero() {
  const slides = hero.slides;
  const stage = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const manualPause = useRef(false);
  const first = useRef(true);

  /* Autoplay only after the entrance, only with motion allowed, and pauses while the pointer or focus is inside. */
  useEffect(() => {
    const go = () => { setReady(true); setAuto(!reducedMotion()); };
    if (document.documentElement.dataset.intro === "done") go();
    else document.addEventListener("intro:done", go, { once: true });
    return () => document.removeEventListener("intro:done", go);
  }, []);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!auto || !ready || hold) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [i, auto, ready, hold, slides.length]);

  /* The film plays only while its chapter is showing and the cover is on screen. */
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    if (i === 0 && !manualPause.current && !reducedMotion()) v.play().catch(() => {}); else v.pause();
  }, [i]);
  useEffect(() => {
    const el = stage.current, v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) v.pause();
      else if (i === 0 && !manualPause.current && !reducedMotion()) v.play().catch(() => {});
    });
    io.observe(el);
    return () => io.disconnect();
  }, [i]);

  /* Copy for the new chapter rises in. */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion() || !text.current) return;
    gsap.fromTo(text.current.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "tm" });
  }, [i]);

  /* Entrance and a gentle scroll-out: the frame opens from a smaller inset; on scroll the picture drifts and the copy lifts. */
  useEffect(() => {
    const el = stage.current;
    if (!el || reducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const frame = el.querySelector(".cover-frame");
    const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];
    const run = () => {
      tweens.push(gsap.timeline()
        .fromTo(frame, { clipPath: "inset(7% 7% 7% 7%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "tm" }, 0)
        .fromTo(el.querySelector(".cover-media"), { scale: 1.14 }, { scale: 1, duration: 2.2, ease: "tm" }, 0)
        .fromTo(el.querySelectorAll(".cover-text > *, .cover-dots, .cover-now, .cover-control"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.07, ease: "tm", clearProps: "transform" }, 0.45));
      tweens.push(gsap.to(el.querySelector(".cover-media"), { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } }));
      tweens.push(gsap.to(el.querySelector(".cover-text"), { y: -40, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "60% top", scrub: true } }));
    };
    if (document.documentElement.dataset.intro === "done") run();
    else document.addEventListener("intro:done", run, { once: true });
    return () => { document.removeEventListener("intro:done", run); tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
  }, []);

  const pick = (n: number) => { setAuto(false); setI(n); };
  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const to = (next + slides.length) % slides.length;
    pick(to);
    requestAnimationFrame(() => document.getElementById(`cover-tab-${to}`)?.focus());
  };
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { manualPause.current = false; v.play().catch(() => {}); } else { manualPause.current = true; v.pause(); }
  };

  const s = slides[i];
  return (
    <section ref={stage} className="cover" id="top" data-tone="light" aria-roledescription="carousel" aria-label="Tomatin Distillery"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <h1 className="sr-only">Tomatin Distillery, award-winning Highland single malt Scotch whisky</h1>
      <div className="cover-frame hero-anim">
        <div className="cover-media">
          {slides.map((t, n) => (
            <div key={t.title} className={`cv-layer${n === i ? " is-active" : ""}`} aria-hidden={n === i ? undefined : true}>
              {t.kind === "film"
                ? <video ref={video} src={hero.film} poster={hero.poster} muted loop playsInline preload="auto" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
                : <Image src={t.image!} alt={n === i ? t.alt! : ""} fill sizes="100vw" priority={n === 1} />}
            </div>
          ))}
        </div>
        <div className="cover-shade" aria-hidden="true" />
        <Conditions />
        <div className="cover-text" ref={text} id="cover-panel" role="tabpanel" aria-labelledby={`cover-tab-${i}`} aria-live={auto ? "off" : "polite"}>
          <p className="eyebrow">{s.label}</p>
          <h2 className="cover-title"><Rich text={s.title} /></h2>
          <Button href={s.cta.href} tone="dark">{s.cta.label}</Button>
        </div>
        <div className="cover-dots" role="tablist" aria-label="Chapters" onKeyDown={onKey}>
          {slides.map((t, n) => (
            <button key={t.title} id={`cover-tab-${n}`} type="button" role="tab" aria-selected={n === i} aria-controls="cover-panel" tabIndex={n === i ? 0 : -1} aria-label={t.title.replace(/\*/g, "")}
              onClick={() => pick(n)} data-run={n === i && auto && ready && !hold ? "true" : undefined}>
              <span>{String(n + 1).padStart(2, "0")}</span><i key={`${i}-${n}`} aria-hidden="true" />
            </button>
          ))}
        </div>
        {s.kind === "film" && (
          <button type="button" className="cover-control" onClick={toggle} aria-pressed={!playing} aria-label={playing ? "Pause film" : "Play film"}>
            <svg viewBox="0 0 10 12" aria-hidden="true">{playing ? <path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z" /> : <path d="M0 0l10 6-10 6z" />}</svg>
          </button>
        )}
      </div>
    </section>
  );
}
