"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Button, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";

/* One screen: the brand film full bleed, palette-washed, with the statement over it.
   Muted, loops, pauses when off screen, has a pause control and a local poster as fallback. The entrance starts on `intro:done`. */
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

  /* Entrance: the film settles, then the copy rises. Waits for the loader handover so both overlap. */
  useEffect(() => {
    const el = stage.current;
    if (!el || reducedMotion()) return;
    const run = () => {
      const film = el.querySelector(".hero-film");
      const copy = el.querySelectorAll(".hero-copy > *");
      gsap.timeline()
        .fromTo(film, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.8, ease: "tm" }, 0)
        .fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "tm", clearProps: "transform" }, 0.1)
        .fromTo(el.querySelector(".hero-control"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.7);
    };
    if (document.documentElement.dataset.intro === "done") { run(); return; }
    document.addEventListener("intro:done", run, { once: true });
    return () => document.removeEventListener("intro:done", run);
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
      <button type="button" className="hero-control hero-anim" onClick={toggle} aria-pressed={!playing} aria-label={playing ? "Pause background film" : "Play background film"}>
        <svg viewBox="0 0 10 12" aria-hidden="true">{playing ? <path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z" /> : <path d="M0 0l10 6-10 6z" />}</svg>
        <span>{playing ? "Pause film" : "Play film"}</span>
      </button>
    </section>
  );
}
