# Tomatin homepage (private prospect demo)

A one-page Next.js rebuild of the tomatin.com homepage in Tomatin's own colours, fonts, film and photography. Layout logic first followed housewine.nl (which redirects to Listed Wines) and reveal behaviour maxwellwines.com.au; from feedback round 3 the editorial layout, live conditions and chapter stage follow moncalisse.com, and the history deck and tilted menu follow imperialebolgheri.com. There is exactly one route.

## Run locally

`npm install`, then `npm run dev` (http://127.0.0.1:3000). `npm run build` and `npm start` for production. `npm run typecheck` checks TypeScript. `npm run scrape` re-downloads every image, font and film into `public/`; then run `scripts/trim-hero.sh` and `python3 scripts/prep-media.py`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The homepage: loader, film hero with live conditions, story (statement, moor strip, origins with film), history deck, recommendations, brand stage, news, footer |

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
| History intro film | 1 aerial loop (blurry at full width) | 1, shown as a small click-to-play tile so the low resolution is not exposed |
| Origins entry | 1 | 1 (three columns inside the story, with the film) |
| Timeline entries | 11 | 6 as a pinned deck of prints (1897, 1909, 1974, 1986, 2002, 2022). Cut: Recession, 1996, 2013, 2016 stay on the live site |
| Recommendations | 6 | 6 |
| Latest news | 3 | 3 (the newest as a feature, two compact) |
| Brands | 4 (from the nav) | 4, on one stage with tabs |
| Footer link groups / socials | 4 / 4 | 4 / 4 |

The four brand blurbs are short phrases from the live homepage timeline copy; the homepage itself has no brand descriptions. "Dualchas American Oak" shows no price, matching the live site.

## Page length

Measured in headless Chrome after scrolling the whole page.

| Viewport | Total height | In screens |
| --- | --- | --- |
| 1440 x 900 | 9,349px (7,099px of content plus 2,250px of pinned scroll) | 10.4 (7.9 without the pin) |
| 768 x 1024 | 8,987px | 8.8 |
| 375 x 812 | 7,520px | 9.3 |

From 900px wide up, the history deck pins and uses half a screen of scroll per year (5 steps). That pinned distance is scroll time rather than content, and it snaps to each year, but it is counted above. Below 900px nothing pins: the deck is swiped instead. At 375px the recommendations also become a swipeable snap row.

## Feedback round 1 (client comments, 1 Oct)

- **Header unreadable over the film:** the header now has a navy top scrim whenever it sits on a dark ground, so the logo and menu always read.
- **More beige and gold, less navy:** the blue colour wash on the hero is gone; the film is graded with a sepia filter towards the brand's beige and gold. Navy is now one content section (brands) plus the footer. Buttons on light grounds are gold.
- **Their own video mid-page:** the live homepage's aerial film now sits in an "Origins" block as a click-to-play tile overlapping a photograph, with copy beside it (layout after the 818 "The Magic" block). It plays with sound on click, and pauses when scrolled away.
- **History shorter and interactive:** the six-card grid is a year picker (click, arrow keys, Home/End, previous/next buttons). The photo cross-fades and the copy rises in. 1,475px of height became 851px.
- **Recommendations above brands**, and every bottle is cropped to its visible bounds and shown at the same height (`scripts/prep-media.py`), so Legacy no longer looks smaller.

## Feedback round 2 (client comments, 5 Oct)

- **Play button off-centre, strip under the film:** the video now fills its tile (it was an inline element leaving a gap), and the button is a centred disc with the triangle optically centred inside it. Measured: disc centre equals tile centre.
- **Logo unreadable while scrolling:** on light sections the header sits on a frosted cream ground with a hairline, so it never collides with the copy under it. On dark sections it keeps the navy top scrim. The hidden header no longer leaves a sliver of scrim behind. This replaces the brief's "no bar or box" on light grounds, at the client's request.
- **History elevated:** a vertical year rail (the active year has a gold line that fills while the section advances itself every 7s, only while on screen, and never after a visitor takes over), one large photograph with the year set big over it and a slow zoom, and the copy on a card that overlaps the photograph. The 1897 certificate and the 2022 image are small, so they are framed whole on navy instead of enlarged.
- **Origins photograph:** the source image has transparent bands on its top and right, which showed as a pale ghost. `scripts/prep-media.py` crops them.

## Feedback round 3 (client comments, 6 Oct: "too big", "no better than what they have", "what has been creatively added?")

New references: moncalisse.com and imperialebolgheri.com. Both were studied in headless Chrome (cookie banners refused, nothing accepted). Measured: Moncalisse uses GSAP and ScrollTrigger, cream grounds, uppercase light serif headings (Canto) with small body copy in columns, a hero landscape with a live vineyard weather card, and a full-bleed chapter slider with a centred card and tabs. Imperiale uses Lenis, a black ground with cream (#E6DDAA) display type (Alfarn, 118px), DM Mono labels, image slides that settle from scale 1.3, and a menu panel rotated 6deg on cubic-bezier(0.165, 0.84, 0.44, 1).

- **History is the centrepiece** (after Imperiale): one screen, pinned. Each year is a print with a cream border and caption, set at its own slight angle; scrolling deals the next print up over the last, the year rolls over digit by digit in large gold type, and the copy beside it changes. It snaps to each year. The whole chapter fits on one screen, which answers "can't read the text unless I scroll". A list of years on the left jumps straight to any year.
- **Hero** (after Moncalisse): live conditions at the distillery (temperature, wind, humidity and local time, from Open-Meteo for the distillery's coordinates). On scroll the film settles into an inset frame on cream and hands over to the story.
- **Story** (after Moncalisse): one editorial section in place of two. An uppercase statement, the copy in columns beside the 1909 photograph, then the moor as a full-bleed strip that opens from an inset frame as it passes (the 2,560px original from the live site), then the origins in three columns with the aerial film tile.
- **Brands** (after Moncalisse): one full-bleed stage. The brand's own photograph fills the section, a centred cream card holds the counter, name, picture, copy and link, and the four brand names run along the bottom as tabs.
- **News**: the newest story as a feature card, two compact rows beside it.
- **Menu** (after Imperiale): the navy panel drops in tilted 6deg and straightens on their curve, then the links rise.

## How it works

- **Loader** (`components/Loader.tsx`): built from the logo's own vectors, and the wordmark is made of letters, so the build is letter by letter. The letters of TOMATIN rise one after another (0.1 to 0.85s), the swash and the rule draw, DISTILLERY wipes open with a clip, then a short hold. At 1.25s the handover happens and a navy curtain wipes up off the hero while the mark fades. One GSAP timeline, 1.81s measured in Chrome (start at 72ms, end at 1,883ms). The loader is server-rendered, so it covers the page from the first frame; its ground is the hero's own navy, so there is no colour jump. Handover removes `is-loading`, sets `data-intro="done"` and fires `intro:done`; the hero entrance and the header wait for that event, so the curtain and the hero overlap. Lenis is stopped until handover. A 3s guard hands over anyway if anything stalls, and a 6s safety in the boot script releases the page if hydration never finishes. Reduced motion skips it (it is hidden in CSS), and `<noscript>` hides it.
- **Hero** (`components/Hero.tsx`): the film full-bleed, graded toward the palette with a sepia filter and a navy gradient, muted, looping, paused when off screen, with a pause control and a local poster. Gold Goldney headline. The conditions card fetches the current weather from Open-Meteo (no key; the request carries only the distillery coordinates) and shows the place, coordinates and London time if the request fails. On scroll a scrubbed timeline clips the film into an inset frame and turns the hero ground cream.
- **Smooth scroll and reveals** (`components/motion.tsx`): Lenis on the GSAP ticker, synced to ScrollTrigger. Anchor links go through Lenis. Overlays stop it.
- **Reveal moves**, each played once on the curve `tm` = `cubic-bezier(0.15, 0.75, 0.5, 1)` (Maxwell's own). Sections marked `data-fast` use 75% of the duration.

| Move | Used on | What it does |
| --- | --- | --- |
| `heading` | every H2 | fade and rise 20px, 0.95s |
| `para` | lead and body copy | fade and rise 14px, 0.85s |
| `label` | eyebrows, buttons, links | fade and rise 8px, 0.6s |
| `card` | film tile, brand card, bottles, news, batched | fade and rise 26px, 0.85s, 0.08s stagger |
| `image` | every photo | clip opens bottom to top (1.15s), then the picture drifts about 10% while scrolling |

- **Showpieces** (the only scrubbed motion besides the hero): the history deck, and the moor strip in the story opening from 9% side insets to full bleed with its picture settling from scale 1.18.
- **History deck** (`components/Chapters.tsx`): one render function places every print from a continuous position (incoming prints rise from below the screen and straighten to their angle with the picture settling from scale 1.25, the current one drops back, shrinks slightly and dims under the next). From 900px wide with motion allowed, a ScrollTrigger pins the section for 5 half-screens of scroll, scrubbed and snapping to each year; the year buttons scroll there through Lenis. Below 900px or with reduced motion nothing pins, and swipe, the arrows or the years move the deck. Without JavaScript only the first print shows.
- **Story** (`components/Story.tsx`): statement, columns and photograph; the moor strip; the origins columns with the click-to-play aerial film (native controls once playing, pauses when scrolled away).
- **Brand stage** (`components/BrandStage.tsx`): ARIA tabs (arrow keys). The background photographs cross-fade under a navy gradient; Shirakawa, being an illustration, shows as cream line art on navy. The card re-opens with a clip from the bottom on each change.
- **Header** (`components/chrome.tsx`): frameless, its colour follows the section under it (`data-tone`), hides on scroll down, returns on scroll up.
- **Menu**: the Menu button opens a full-screen navy panel that drops in tilted 6deg and straightens (Imperiale's curve), then the links rise; reversed to close. Focus is trapped, Esc closes it, focus returns to the button. Section links scroll through Lenis; the rest open the real tomatin.com URL in a new tab.
- **Copied interaction** (Maxwell `.l-button` and `.l-link-underline`, measured on maxwellwines.com.au): the button is outlined, 12px 24px, 13px uppercase, `transition 0.3s ease-out`, and fills on hover, with the border moving to the fill. The text link is 4px padding, small uppercase, and a border-top that goes from transparent to the text colour on hover. Both are in `app/globals.css` (`.btn`, `.link-arrow`) with the source values commented. Checked in Chrome: same padding, size, timing and easing.
- **Imagery:** the hero is the brand film; the story carries the 1909 photograph, the moor and the stills; the history deck, bottles, brand stage and news follow.
- **Links:** every card, "see more" and "find out more" goes to the real URL and opens in a new tab with `rel="noopener"`. In-page anchors are only the section links.
- **Reduced motion:** no loader, no smooth scroll, no reveals, all content visible, the film does not autoplay.
- **No JavaScript:** everything is visible, the loader is hidden, the film shows its poster.

## Code layout

- `app/` layout (fonts, boot script, noindex, PostHog), page, global CSS (tokens, type scale, buttons)
- `components/` `Home`, `Loader`, `Hero`, `Story`, `Chapters`, `BrandStage`, `chrome` (header and menu), `sections` (recommendations, news, footer), `motion`, `ui`
- `lib/` `content.ts` (all copy), `menu.ts`, `logo-paths.ts` (generated), `brand-icons.ts`, `posthog.ts`, `scroll.ts`
- `scripts/` `scrape-assets.mjs`, `trim-hero.sh`, `prep-media.py`, `build-logo.py`

## Private demo settings

- `robots` is `noindex, nofollow`. There is no sitemap.
- PostHog (EU) and the 25/50/75/100% scroll-depth events (each fires once) are in `lib/posthog.ts`, injected in `<head>`. The key can be overridden with `NEXT_PUBLIC_POSTHOG_KEY`. No visible tracking UI.
- The page has no age gate; the footer carries an 18+ and "enjoy responsibly" note.
- One third-party request besides PostHog: the hero's conditions card calls api.open-meteo.com with the distillery's fixed coordinates. No visitor data is sent beyond what any request carries.

## Where the images came from

Every image, the brand film and the brand fonts come from tomatin.com (`/wp-content/uploads/`, the Wistia delivery of the homepage loop, and the site's own `@font-face` files). News images are each post's `og:image`. `scripts/scrape-assets.mjs` lists every source URL.
