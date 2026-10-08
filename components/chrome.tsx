"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useCallback, useEffect, useRef, useState } from "react";
import { focusOverlay } from "@/components/motion";
import { A, Logo, Social, reducedMotion } from "@/components/ui";
import { brandIcons } from "@/lib/brand-icons";
import { footer, url } from "@/lib/content";
import { menu } from "@/lib/menu";

/* Frameless header plus the full-screen menu. The menu is a GSAP timeline: a tilted navy panel drops in and straightens, then the links rise. Reversed to close. */
export function Header() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    /* The panel drops in tilted and straightens (imperialebolgheri.com menu: 6deg, cubic-bezier(0.165, 0.84, 0.44, 1)), then the links rise. */
    gsap.registerPlugin(CustomEase);
    CustomEase.create("imp", "0.165, 0.84, 0.44, 1");
    const t = gsap.timeline({ paused: true, onReverseComplete: () => { el.dataset.open = "false"; } });
    t.fromTo(el.querySelector(".menu-bg"), { yPercent: -105, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.9, ease: "imp" })
      .fromTo(el.querySelectorAll("[data-rise]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "tm" }, 0.35)
      .fromTo(el.querySelector(".menu-side"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "tm" }, 0.5);
    tl.current = t;
    return () => { t.kill(); };
  }, []);

  useEffect(() => {
    const el = panel.current;
    const t = tl.current;
    if (!el || !t) return;
    const root = document.documentElement;
    if (open) {
      el.dataset.open = "true";
      root.classList.add("menu-open");
      if (reducedMotion()) t.progress(1); else t.play();
      const release = focusOverlay(el, close);
      return () => { release(); root.classList.remove("menu-open"); if (reducedMotion()) { t.progress(0); el.dataset.open = "false"; } else t.reverse(); };
    }
  }, [open, close]);

  return (
    <>
      <a className="skip" href="#story">Skip to content</a>
      {/* Symmetric, after themacallan.com: menu on the left, the wordmark centred, the shop on the right */}
      <header className="site-header" data-tone="light">
        <button ref={trigger} type="button" className="menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="menu" onClick={() => setOpen((v) => !v)}>
          <span className="bars" aria-hidden="true"><i /><i /></span><span>{open ? "Close" : "Menu"}</span>
        </button>
        <a href="#top" className="brand" aria-label="Tomatin Distillery, back to top"><Logo /></a>
        <A href={url("/shop/")} className="nav-link">Shop</A>
      </header>
      <div id="menu" ref={panel} className="menu" role="dialog" aria-modal="true" aria-label="Menu" data-open="false">
        <div className="menu-bg" aria-hidden="true" />
        <div className="menu-grid">
          <div>
            <ul className="menu-primary">
              {menu.primary.map((l) => <li key={l.href}><a href={l.href} data-rise onClick={close}>{l.label}</a></li>)}
            </ul>
            <ul className="menu-live">
              {menu.live.map((l) => <li key={l.href}><A href={l.href} className="link-arrow">{l.label}</A></li>)}
            </ul>
          </div>
          <div className="menu-side">
            <h3>Our brands</h3>
            <ul>{menu.brands.map((l) => <li key={l.href}><A href={l.href}>{l.label}</A></li>)}</ul>
            <h3>Contact</h3>
            <ul><li><A href={menu.contact.href}>{menu.contact.label}</A></li></ul>
            <h3>Follow us</h3>
            <div className="socials">
              {footer.socials.map((s) => <A key={s.name} href={s.href} label={s.name}><Social path={brandIcons[s.icon]} name={s.name} /></A>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
