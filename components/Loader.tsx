"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/ui";
import { reducedMotion } from "@/components/ui";

/* The company signing its name. One GSAP timeline, three stages, 1.8s in total:
   build  (0.1 to 0.85s) the letters of TOMATIN rise one after another, the swash and rule draw, DISTILLERY wipes open
   hold   (to 1.25s)
   exit   (1.25 to 1.8s) the navy curtain wipes up off the hero while the mark fades.
   Handover happens as the exit starts, so the hero entrance and the curtain overlap into one movement. */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    gsap.registerPlugin(CustomEase);
    CustomEase.create("tm", "0.15, 0.75, 0.5, 1");
    performance.mark("loader:start");
    const handover = () => {
      performance.mark("loader:handover");
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    delete root.dataset.intro;
    if (reducedMotion()) { handover(); el.style.display = "none"; return; }
    root.classList.add("is-loading");

    const letters = el.querySelectorAll(".lg-top path");
    const tl = gsap.timeline({ onComplete: () => { performance.mark("loader:end"); el.style.display = "none"; } });
    tl.fromTo(letters, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power3.out" }, 0.1)
      .fromTo(el.querySelector(".lg-swash"), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 0.4)
      .fromTo(el.querySelector(".rule"), { opacity: 0, scaleX: 0, svgOrigin: "250 106" }, { opacity: 1, scaleX: 1, duration: 0.5, ease: "tm" }, 0.45)
      .fromTo(el.querySelector(".lg-sub"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power2.inOut" }, 0.5)
      .call(handover, undefined, 1.25)
      .to(el.querySelector(".logo"), { opacity: 0, y: -12, duration: 0.4, ease: "power2.in" }, 1.25)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "power2.inOut" }, 1.25);

    /* Never hold the page hostage: if anything stalls, hand over after 3s regardless. */
    const guard = window.setTimeout(() => { if (root.dataset.intro !== "done") { handover(); tl.progress(1); } }, 3000);
    return () => { window.clearTimeout(guard); tl.kill(); root.classList.remove("is-loading"); };
  }, []);

  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <Logo className="logo" label={false} />
    </div>
  );
}
