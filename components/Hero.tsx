"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Button, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";

type Now = { t: number; wind: number; hum: number } | null;

/* Live conditions at the distillery, after the vineyard weather card on moncalisse.com, set as a quiet line in the beige bar.
   Open-Meteo needs no key and sends no visitor data. If the request fails the bar still shows the place, coordinates and local time. */
function Conditions() {
  const [now, setNow] = useState<Now>(null);
  const [time, setTime] = useState("");
  useEffect(() => {
    const { lat, lon } = hero.place;
    const ctrl = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&wind_speed_unit=ms&timezone=Europe%2FLondon`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { const c = d?.current; if (c) setNow({ t: c.temperature_2m, wind: c.wind_speed_10m, hum: c.relative_humidity_2m }); })
      .catch(() => {});
    const clock = () => setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(new Date()));
    clock();
    const id = window.setInterval(clock, 30000);
    return () => { ctrl.abort(); window.clearInterval(id); };
  }, []);
  return (
    <div className="cover-bar-inner" aria-label={`Now at ${hero.place.name}`}>
      <p className="cover-place"><span className="dot" aria-hidden="true" />{hero.place.name}<span className="cover-coords">{hero.place.latLabel}, {hero.place.lonLabel}</span></p>
      <p className="cover-now">
        {now && <span className="cover-temp">{now.t.toFixed(1)}°C</span>}
        {now && <span className="cover-extra">Wind {now.wind.toFixed(1)} m/s</span>}
        {now && <span className="cover-extra">Humidity {Math.round(now.hum)}%</span>}
        <span>{time} in Tomatin</span>
      </p>
    </div>
  );
}

/* The front cover. Not their full-bleed film: a cream page with a beige bar of live conditions under the header, the script
   statement and actions on the left, and the brand film playing inside a tall arch on the right, like a still-house window.
   With motion allowed the film is laid full-bleed underneath and clipped to the arch; scrolling opens the arch out to the
   whole section before the story begins. Without that (reduced motion, no JavaScript) the film simply stays in its arch.
   Muted, loops, pauses off screen, has a pause control and a local poster. The entrance starts on `intro:done`. */
export function Hero() {
  const stage = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const manualPause = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    if (reducedMotion()) { manualPause.current = true; return; }
    v.play().catch(() => setPlaying(false));
  }, []);

  useEffect(() => {
    const el = stage.current, v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) v.pause();
      else if (!manualPause.current) v.play().catch(() => {});
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = stage.current, s = slot.current, f = film.current;
    if (!el || !s || !f || reducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    /* The arch, expressed as a clip on the full-bleed film: the slot's edges measured from the section's edges. */
    const arch = () => {
      const h = el.getBoundingClientRect(), r = s.getBoundingClientRect();
      const rad = r.width / 2;
      return `inset(${r.top - h.top}px ${h.right - r.right}px ${h.bottom - r.bottom}px ${r.left - h.left}px round ${rad}px ${rad}px 0px 0px)`;
    };
    el.classList.add("is-open-able");
    gsap.set(f, { clipPath: arch() });

    let open: gsap.core.Tween | null = null;
    const run = () => {
      gsap.timeline()
        .fromTo(f, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "tm" }, 0)
        .fromTo(f.querySelector("video"), { scale: 1.12 }, { scale: 1, duration: 2, ease: "tm" }, 0)
        .fromTo(el.querySelectorAll(".cover-copy > *"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: "tm", clearProps: "transform" }, 0.1)
        .fromTo(el.querySelector(".cover-bar"), { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "tm" }, 0.2);
      open = gsap.fromTo(f, { clipPath: arch }, {
        clipPath: "inset(0px 0px 0px 0px round 0px 0px 0px 0px)",
        ease: "none",
        scrollTrigger: {
          trigger: el, start: "top top", end: "bottom 35%", scrub: true, invalidateOnRefresh: true,
          onUpdate: (self) => { el.dataset.tone = self.progress > 0.45 ? "dark" : "light"; },
        },
      });
      gsap.to(el.querySelector(".cover-copy"), { opacity: 0, y: -60, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "40% top", scrub: true } });
    };
    if (document.documentElement.dataset.intro === "done") run();
    else document.addEventListener("intro:done", run, { once: true });
    return () => { document.removeEventListener("intro:done", run); open?.scrollTrigger?.kill(); open?.kill(); el.classList.remove("is-open-able"); };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { manualPause.current = false; v.play().catch(() => {}); } else { manualPause.current = true; v.pause(); }
  };

  return (
    <section ref={stage} className="cover" id="top" data-tone="light" aria-label="Introduction">
      <div className="cover-bar hero-anim"><Conditions /></div>
      <div className="cover-grid">
        <div className="cover-copy hero-anim">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <div className="hero-actions">
            <Button href={hero.primary.href} tone="gold">{hero.primary.label}</Button>
            <Button href={hero.secondary.href} tone="light">{hero.secondary.label}</Button>
          </div>
          <button type="button" className="hero-control" onClick={toggle} aria-pressed={!playing} aria-label={playing ? "Pause background film" : "Play background film"}>
            <svg viewBox="0 0 10 12" aria-hidden="true">{playing ? <path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z" /> : <path d="M0 0l10 6-10 6z" />}</svg>
            <span>{playing ? "Pause film" : "Play film"}</span>
          </button>
        </div>
        <div className="cover-slot" ref={slot}>
          <div className="cover-film" ref={film}>
            <video ref={video} src={hero.film} poster={hero.poster} muted loop playsInline preload="auto" aria-hidden="true"
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          </div>
        </div>
      </div>
    </section>
  );
}
