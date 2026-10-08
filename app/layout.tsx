import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";

// Goldney and Gordita are Tomatin's own brand fonts (from their @font-face rules). Newsreader (OFL) stands in for freight-neo-pro, which is a licensed Typekit face.
const display = localFont({ src: "../public/fonts/Goldney.woff2", variable: "--font-display", display: "swap", preload: false });
const ui = localFont({
  src: [
    { path: "../public/fonts/Gordita-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Gordita-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-ui",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "../public/fonts/Newsreader.woff2", weight: "300 500", style: "normal" },
    { path: "../public/fonts/Newsreader-Italic.woff2", weight: "300 500", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tomatin Distillery | Highland single malt Scotch whisky",
  description: "Award-winning Highland single malt Scotch whisky, made at Tomatin since 1897.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/icon-192.png", apple: "/brand/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#fef9ec" };

// Runs before first paint: marks JS and motion support so the loader covers the page from the very first frame.
// If hydration never finishes, the safety timer releases the page after 6s.
const boot = `(function(d){var r=d.documentElement;r.classList.add("js");if(!matchMedia("(prefers-reduced-motion: reduce)").matches){r.classList.add("js-motion","is-loading");setTimeout(function(){if(!r.dataset.ready){r.classList.remove("js-motion","is-loading")}},6000)}})(document);`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${ui.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <noscript><style>{".loader{display:none!important}"}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
