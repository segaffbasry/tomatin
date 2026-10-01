"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Rich } from "@/components/ui";
import { origins } from "@/lib/content";

/* The mid-page story block: a tall photograph with the distillery's own aerial film overlapping it (play button on the film), copy beside it. */
export function Origins() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  /* Pause when scrolled away so it never plays unseen. */
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
    <section id="origins" className="section tone-sand" data-tone="light" aria-labelledby="origins-title">
      <div className="wrap origins-grid">
        <div className="origins-media">
          <div className="frame origins-photo" data-image>
            <Image src={origins.image.src} alt={origins.image.alt} fill sizes="(max-width: 900px) 70vw, 34vw" />
          </div>
          <div className="origins-film" data-reveal="card" data-playing={playing}>
            <video ref={video} src={origins.film.src} poster={origins.film.poster} playsInline preload="none" aria-label={origins.film.alt}
              onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); if (video.current) { video.current.controls = false; video.current.load(); } }} />
            <button type="button" className="play-btn" onClick={play} aria-label={`${origins.film.label}: ${origins.film.alt}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
            </button>
          </div>
        </div>
        <div className="origins-text">
          <p className="eyebrow" data-reveal="label">{origins.eyebrow}</p>
          <h2 className="h2" id="origins-title" data-reveal="heading"><Rich text={origins.title} /></h2>
          <p className="copy" data-reveal="para">{origins.text}</p>
          <div data-reveal="label"><Button href={origins.cta.href} tone="gold">{origins.cta.label}</Button></div>
        </div>
      </div>
    </section>
  );
}
