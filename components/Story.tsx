"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Rich, reducedMotion } from "@/components/ui";
import { intro, origins } from "@/lib/content";

/* The story, laid out editorially (after moncalisse.com): a large uppercase statement with the copy in columns and the 1909 photograph,
   then the moor as a full-bleed strip that opens from an inset frame as it scrolls through, then the origins in three columns
   with the distillery's own aerial film as a small click-to-play tile. */
export function Story() {
  const strip = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = strip.current;
    if (!el || reducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true } })
      .fromTo(el, { clipPath: "inset(0% 9% 0% 9%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
      .fromTo(el.querySelector("img"), { scale: 1.18 }, { scale: 1, ease: "none" }, 0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const play = () => {
    const v = video.current;
    if (!v) return;
    v.controls = true;
    v.muted = false;
    v.play().then(() => setPlaying(true)).catch(() => { v.muted = true; v.play().then(() => setPlaying(true)).catch(() => {}); });
  };

  return (
    <section id="story" className="story tone-cream" data-tone="light" aria-labelledby="story-title">
      <div className="section story-open">
        <div className="wrap story-grid">
          <div className="story-head">
            <p className="eyebrow" data-reveal="label">{intro.eyebrow}</p>
            <h2 className="statement" id="story-title" data-reveal="heading"><Rich text={intro.title} /></h2>
          </div>
          <p className="lead story-lead" data-reveal="para">{intro.lead}</p>
          <div className="story-side" data-reveal="para">
            <p className="copy">{intro.body}</p>
            <Button href={intro.cta.href} tone="gold">{intro.cta.label}</Button>
          </div>
          <figure className="story-photo">
            <div className="frame" data-image><Image src={intro.image.src} alt={intro.image.alt} fill sizes="(max-width: 900px) 92vw, 40vw" /></div>
            <figcaption>1909 · The New Tomatin Distillers Company</figcaption>
          </figure>
        </div>
      </div>

      <div className="story-strip" ref={strip}>
        <Image src={intro.landscape.src} alt={intro.landscape.alt} fill sizes="100vw" />
        <p className="story-strip-cap">{intro.landscape.caption}</p>
      </div>

      <div className="section story-origins">
        <div className="wrap origins-cols">
          <div>
            <p className="eyebrow" data-reveal="label">{origins.eyebrow}</p>
            <h3 className="statement statement--sm" data-reveal="heading">{origins.title}</h3>
          </div>
          <div className="origins-copy" data-reveal="para">
            <p className="copy">{origins.text}</p>
            <Button href={origins.cta.href} tone="light">{origins.cta.label}</Button>
          </div>
          <div className="origins-media">
            <div className="frame origins-photo" data-image>
              <Image src={origins.stills.src} alt={origins.stills.alt} fill sizes="(max-width: 900px) 70vw, 26vw" />
            </div>
            <div className="origins-film" data-reveal="card" data-playing={playing}>
              <video ref={video} src={origins.film.src} poster={origins.film.poster} playsInline preload="none" aria-label={origins.film.alt}
                onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); if (video.current) { video.current.controls = false; video.current.load(); } }} />
              <button type="button" className="play-btn" onClick={play} aria-label={`${origins.film.label}: ${origins.film.alt}`}>
                <span className="disc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12l9-6z" /></svg></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
