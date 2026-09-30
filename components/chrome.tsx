"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { focusOverlay } from "@/components/motion";
import { A, Logo, Social, reducedMotion } from "@/components/ui";
import { brandIcons } from "@/lib/brand-icons";
import { footer, url } from "@/lib/content";
import { menu } from "@/lib/menu";

/* Frameless header plus the full-screen menu. The menu is a GSAP timeline: the navy curtain wipes down, then the links rise. Reversed to close. */
export function Header() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const t = gsap.timeline({ paused: true, onReverseComplete: () => { el.dataset.open = "false"; } });
    t.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.inOut" })
      .fromTo(el.querySelectorAll("[data-rise]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "tm" }, 0.3);
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
      <header className="site-header" data-tone="dark">
        <a href="#top" className="brand" aria-label="Tomatin Distillery, back to top"><Logo /></a>
        <nav aria-label="Main">
          <A href={url("/shop/")} className="nav-link">Shop</A>
          <button ref={trigger} type="button" className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((v) => !v)}>
            <span>{open ? "Close" : "Menu"}</span><span className="bars" aria-hidden="true"><i /><i /></span>
          </button>
        </nav>
      </header>
      <div id="menu" ref={panel} className="menu" role="dialog" aria-modal="true" aria-label="Menu" data-open="false">
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
