import type { ReactNode } from "react";
import { logo } from "@/lib/logo-paths";
import { isExternal } from "@/lib/menu";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The wordmark, rebuilt as vectors. Letters are separate paths so the loader can build it one by one (scripts/build-logo.py). */
export function Logo({ className = "", label = true }: { className?: string; label?: boolean }) {
  return (
    <svg className={`logo ${className}`} viewBox={`-2 0 ${logo.w + 4} ${logo.h}`} role={label ? "img" : undefined} aria-label={label ? "Tomatin Distillery" : undefined} aria-hidden={label ? undefined : true}>
      <g className="lg-top">{logo.top.map((d, i) => <path key={i} d={d} />)}</g>
      <path className="lg-swash" d={logo.swash} />
      <path className="rule" d={logo.rule} />
      <g className="lg-sub">{logo.sub.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

export function Arrow() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" /></svg>;
}

/* Real-site links open in a new tab; in-page anchors go through Lenis (see motion.tsx). */
export function A({ href, className, children, label }: { href: string; className?: string; children: ReactNode; label?: string }) {
  const ext = isExternal(href);
  return <a href={href} className={className} aria-label={label} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{children}</a>;
}

export function Button({ href, children, tone = "light" }: { href: string; children: ReactNode; tone?: "light" | "dark" | "solid" }) {
  return <A href={href} className={`btn btn--${tone}`}>{children}</A>;
}

export function TextLink({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return <A href={href} className="link-arrow" label={label}>{children}<Arrow /></A>;
}

export function Social({ path, name }: { path: string; name: string }) {
  return <svg viewBox="0 0 24 24" role="img" aria-label={name}><title>{name}</title><path d={path} /></svg>;
}

/* Headlines mark their italic word with *asterisks* in lib/content.ts. */
export function Rich({ text }: { text: string }) {
  return <>{text.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}</>;
}
