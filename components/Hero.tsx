"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Button, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";

type Now = { t: number; wind: number; hum: number } | null;

/* Live conditions at the distillery, after the vineyard widget on moncalisse.com. Open-Meteo needs no key and sends no visitor data.
   If the request fails the widget still shows the place, coordinates and local time. */
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
    <div className="conditions" aria-label={`Now at ${hero.place.name}`}>
      <p className="conditions-place">{hero.place.name}<span>{hero.place.latLabel} · {hero.place.lonLabel}</span></p>
      <p className="conditions-temp">{now ? `${now.t.toFixed(1)}°C` : "—"}<span>{time}</span></p>
      <p className="conditions-meta"><span>{now ? `${now.wind.toFixed(1)} m/s` : "wind"}</span><span>{now ? `${Math.round(now.hum)}%` : "humidity"}</span></p>
    </div>
  );
}

/* One screen: the brand film full bleed, graded toward the palette, with the statement over it.
   Muted, loops, pauses off screen, has a pause control and a local poster. The entrance starts on `intro:done`.
   On scroll the film settles into an inset frame on cream (after the landscape on moncalisse.com), handing over to the story. */
export function Hero() {
  const stage = useRef<HTMLElement>(null);
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

  /* Entrance (waits for the loader handover so both overlap), then the scroll-out settle. */
  useEffect(() => {
    const el = stage.current;
    if (!el || reducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const film = el.querySelector(".hero-film");
    let settle: gsap.core.Timeline | null = null;
    const run = () => {
      gsap.timeline()
        .fromTo(film, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.8, ease: "tm" }, 0)
        .fromTo(el.querySelectorAll(".hero-copy > *"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "tm", clearProps: "transform" }, 0.1)
        .fromTo(el.querySelectorAll(".hero-side > *"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "tm" }, 0.6);
      settle = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } })
        .to(el, { backgroundColor: "#fef9ec", ease: "none", duration: 0.2 }, 0)
        .fromTo(film, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(6% 4% 14% 4%)", ease: "none" }, 0)
        .to(el.querySelector(".hero-inner"), { y: -80, opacity: 0, ease: "none" }, 0)
        .to(el.querySelector(".hero-side"), { y: -60, opacity: 0, ease: "none" }, 0);
    };
    if (document.documentElement.dataset.intro === "done") run();
    else document.addEventListener("intro:done", run, { once: true });
    return () => { document.removeEventListener("intro:done", run); settle?.scrollTrigger?.kill(); settle?.kill(); };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { manualPause.current = false; v.play().catch(() => {}); } else { manualPause.current = true; v.pause(); }
  };

  return (
    <section ref={stage} className="hero" id="top" data-tone="dark" aria-label="Introduction">
      <div className="hero-film">
        <video ref={video} src={hero.film} poster={hero.poster} muted loop playsInline preload="auto" aria-hidden="true"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      </div>
      <div className="hero-inner hero-anim">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <div className="hero-actions">
            <Button href={hero.primary.href} tone="solid">{hero.primary.label}</Button>
            <Button href={hero.secondary.href} tone="dark">{hero.secondary.label}</Button>
          </div>
        </div>
      </div>
      <div className="hero-side hero-anim">
        <Conditions />
        <button type="button" className="hero-control" onClick={toggle} aria-pressed={!playing} aria-label={playing ? "Pause background film" : "Play background film"}>
          <svg viewBox="0 0 10 12" aria-hidden="true">{playing ? <path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z" /> : <path d="M0 0l10 6-10 6z" />}</svg>
          <span>{playing ? "Pause film" : "Play film"}</span>
        </button>
      </div>
    </section>
  );
}
