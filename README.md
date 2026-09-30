# Tomatin homepage (private prospect demo)

A one-page Next.js rebuild of the tomatin.com homepage in Tomatin's own colours, fonts, film and photography. Layout logic follows housewine.nl (which redirects to Listed Wines); scroll and reveal behaviour follows maxwellwines.com.au. There is exactly one route.

## Run locally

`npm install`, then `npm run dev` (http://127.0.0.1:3000). `npm run build` and `npm start` for production. `npm run typecheck` checks TypeScript. `npm run scrape` re-downloads every image, font and the film into `public/` (then run `scripts/trim-hero.sh`).

## Pages

| Route | What it is |
| --- | --- |
| `/` | The homepage: loader, film hero, story, timeline, brands, recommendations, news, footer |

The build produces the homepage plus the framework's own `/_not-found` route and nothing else.

## Recon notes

- **Live site:** tomatin.com sits behind an 18+ age gate. The gate was not clicked; copy, links and images were read from the DOM behind it. Link destinations were checked against the `post`, `page` and `product` sitemaps and then HTTP-tested (all 28 external links return 200).
- **Look reference** `housewine.nl` redirects to listedwines.com (a wine marketplace SaaS). Taken from it: a dark hero leading into warm light sections, light serif headlines with italic emphasis, tight section rhythm, about 6,700px of total height.
- **Motion reference** `maxwellwines.com.au` is a Shopify theme with no Lenis or GSAP and no scroll recolouring (a single flat ground). Taken from it: the reveal curve `cubic-bezier(0.15, 0.75, 0.5, 1)` (opacity and transform, 0.6 to 0.8s), hover timing `0.3s ease-out`, the full-bleed film hero. Because it does not recolour on scroll, the brief's blended scene backdrop is not used; sections have plain grounds.
- **Logo:** the live site only ships a 170x47 PNG. The wordmark was rebuilt as vector (`scripts/build-logo.py`) from Marcellus (OFL), the closest open match to the flared Roman capitals, with a hand-drawn swash on the A. It is an approximation of the real logo, not a trace.
- **Fonts:** Goldney (display) and Gordita (UI) are Tomatin's own, taken from their `@font-face` rules. Their serif, freight-neo-pro, is a licensed Typekit face, so Newsreader (OFL, subset to Latin) stands in for it.
- **Brand film:** the hero uses the muted brand loop from the live homepage (Wistia delivery, 1280x720), trimmed by `scripts/trim-hero.sh` to drop the near-black first 4.2s and the audio.

## Palette

Four colours, all measured from tomatin.com computed styles. No other hue is used in the interface. Tints are the same colours at lower alpha. Product photography and film bring their own colour.

| Token | Hex | Where it came from |
| --- | --- | --- |
| `--navy` | `#123059` | body text colour |
| `--gold` | `#B4A76C` | H2 and button fill |
| `--cream` | `#FEF9EC` | section fill |
| `--sand` | `#E6E3D5` | section fill |

Gold is used for accents, buttons and large type on navy only (it does not reach text contrast on cream). Text is navy on cream and sand, cream on navy.

## Homepage sections and content counts

| Section | Live homepage | This build |
| --- | --- | --- |
| Hero film | 1 loop | 1 loop (trimmed, muted, no audio) |
| Hero calls to action | 3 (Discover Our Whisky, Book a Tour, Watch Our Full Film) | 2. "Watch Our Full Film" opens a popup whose video loads lazily and could not be retrieved, so it is left out rather than linked wrongly. A pause control replaces it |
| Promo banners | 3 (Kurokabegura, Mystery Whisky, Black Friday 2025) | 0. They are shop promotions, and the Black Friday one is stale. The Shop link covers them |
| History intro | 1 | 1 |
| Timeline entries | 11 | 6 (1897, 1909, 1974, 1986, 2002, 2022), for page length. Cut: Origins, Recession, 1996, 2013, 2016. They stay on the live site |
| Recommendations | 6 | 6 |
| Latest news | 3 | 3 |
| Brand cards | 4 (from the nav) | 4 |
| Footer link groups / socials | 4 / 4 | 4 / 4 |

The four brand blurbs are short phrases from the live homepage timeline copy; the homepage itself has no brand descriptions. "Dualchas American Oak" shows no price, matching the live site.

## Page length

Measured in headless Chrome after scrolling the whole page.

| Viewport | Total height | In screens |
| --- | --- | --- |
| 1440 x 900 | 6,174px | 6.9 |
| 768 x 1024 | 7,852px | 7.7 |
| 375 x 812 | 6,836px | 8.4 |

At 375px the timeline and the recommendations become swipeable snap rows, which is what keeps the phone layout near eight screens.

## How it works

- **Loader** (`components/Loader.tsx`): built from the logo's own vectors, and the wordmark is made of letters, so the build is letter by letter. The letters of TOMATIN rise one after another (0.1 to 0.85s), the swash and the rule draw, DISTILLERY wipes open with a clip, then a short hold. At 1.25s the handover happens and a navy curtain wipes up off the hero while the mark fades. One GSAP timeline, 1.81s measured in Chrome (start at 72ms, end at 1,883ms). The loader is server-rendered, so it covers the page from the first frame; its ground is the hero's own navy, so there is no colour jump. Handover removes `is-loading`, sets `data-intro="done"` and fires `intro:done`; the hero entrance and the header wait for that event, so the curtain and the hero overlap. Lenis is stopped until handover. A 3s guard hands over anyway if anything stalls, and a 6s safety in the boot script releases the page if hydration never finishes. Reduced motion skips it (it is hidden in CSS), and `<noscript>` hides it.
- **Hero** (`components/Hero.tsx`): the film full-bleed under a navy wash (a `color` blend plus a gradient), muted, looping, paused when off screen, with a pause control and a local poster. Gold Goldney headline.
- **Smooth scroll and reveals** (`components/motion.tsx`): Lenis on the GSAP ticker, synced to ScrollTrigger. Anchor links go through Lenis. Overlays stop it.
- **Reveal moves**, each played once on the curve `tm` = `cubic-bezier(0.15, 0.75, 0.5, 1)` (Maxwell's own). Sections marked `data-fast` use 75% of the duration.

| Move | Used on | What it does |
| --- | --- | --- |
| `heading` | every H2 | fade and rise 20px, 0.95s |
| `para` | lead and body copy | fade and rise 14px, 0.85s |
| `label` | eyebrows, buttons, links | fade and rise 8px, 0.6s |
| `card` | timeline, brands, bottles, news, batched | fade and rise 26px, 0.85s, 0.08s stagger |
| `image` | every photo | clip opens bottom to top (1.15s), then the picture drifts about 10% while scrolling |

- **Header** (`components/chrome.tsx`): frameless, its colour follows the section under it (`data-tone`), hides on scroll down, returns on scroll up.
- **Menu**: the Menu button opens a full-screen navy panel (curtain wipe, then the links rise; reversed to close). Focus is trapped, Esc closes it, focus returns to the button. Section links scroll through Lenis; the rest open the real tomatin.com URL in a new tab.
- **Copied interaction** (Maxwell `.l-button` and `.l-link-underline`, measured on maxwellwines.com.au): the button is outlined, 12px 24px, 13px uppercase, `transition 0.3s ease-out`, and fills on hover, with the border moving to the fill. The text link is 4px padding, small uppercase, and a border-top that goes from transparent to the text colour on hover. Both are in `app/globals.css` (`.btn`, `.link-arrow`) with the source values commented. Checked in Chrome: same padding, size, timing and easing.
- **Imagery:** the hero is the brand film; the next section (story) and the timeline are photographic, then brands, bottles and news.
- **Links:** every card, "see more" and "find out more" goes to the real URL and opens in a new tab with `rel="noopener"`. In-page anchors are only the section links.
- **Reduced motion:** no loader, no smooth scroll, no reveals, all content visible, the film does not autoplay.
- **No JavaScript:** everything is visible, the loader is hidden, the film shows its poster.

## Code layout

- `app/` layout (fonts, boot script, noindex, PostHog), page, global CSS (tokens, type scale, buttons)
- `components/` `Home`, `Loader`, `Hero`, `chrome` (header and menu), `sections` (story, timeline, brands, recommendations, news, footer), `motion`, `ui`
- `lib/` `content.ts` (all copy), `menu.ts`, `logo-paths.ts` (generated), `brand-icons.ts`, `posthog.ts`, `scroll.ts`
- `scripts/` `scrape-assets.mjs`, `trim-hero.sh`, `build-logo.py`

## Private demo settings

- `robots` is `noindex, nofollow`. There is no sitemap.
- PostHog (EU) and the 25/50/75/100% scroll-depth events (each fires once) are in `lib/posthog.ts`, injected in `<head>`. The key can be overridden with `NEXT_PUBLIC_POSTHOG_KEY`. No visible tracking UI.
- The page has no age gate; the footer carries an 18+ and "enjoy responsibly" note.

## Where the images came from

Every image, the brand film and the brand fonts come from tomatin.com (`/wp-content/uploads/`, the Wistia delivery of the homepage loop, and the site's own `@font-face` files). News images are each post's `og:image`. `scripts/scrape-assets.mjs` lists every source URL.
