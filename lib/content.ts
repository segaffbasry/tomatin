// All homepage copy. Text is taken verbatim from tomatin.com (read 1 Oct 2026); links were checked against the live sitemaps.
export const SITE = "https://tomatin.com";
export const url = (path: string) => `${SITE}${path}`;

export const hero = {
  eyebrow: "Award-winning Highland single malt Scotch whisky",
  title: "To what matters",
  film: "/media/hero/hero.mp4",
  poster: "/media/hero/poster.jpg",
  primary: { label: "Discover Our Whisky", href: url("/tomatin/our-whisky/") },
  secondary: { label: "Book a Tour", href: url("/tours/") },
};

export const intro = {
  eyebrow: "Our story",
  title: "Established in *1897*",
  lead: "It was always our goal to provide a home for our dedicated craftsmen and their families. Working at Tomatin, even in today’s modern world, is more than just a job. It’s a way of life.",
  body: "Whisky production has been central to the way of life in this area most probably since the 15th century and certainly since 1897 when the first formal distillery on the site was established.",
  cta: { label: "Book a tour", href: url("/tours/") },
  images: [
    { src: "/media/history/1909.webp", w: 785, h: 523, alt: "Distillery workers and their families, early twentieth century" },
    { src: "/media/history/2002.webp", w: 720, h: 480, alt: "A copper still inside Tomatin distillery" },
  ],
};

// Mid-page story block: copy is the live homepage's "Origins" entry; the film is the aerial loop from the live "Our history" section.
export const origins = {
  eyebrow: "Origins",
  title: "The origins of whisky production in Scotland",
  text: "The origins of whisky production in Tomatin are hard to be precise about – prior to the opening of the formal distillery which operates today, there is reason to believe that whisky production, albeit illegal, has been an important part of life in the area around Tomatin since the 1700s.",
  cta: { label: "Book a tour", href: url("/tours/") },
  image: { src: "/media/history/origins.webp", w: 474, h: 476, alt: "Copper and timber inside the distillery, lit by a window" },
  film: { src: "/media/film/aerial.mp4", poster: "/media/film/aerial-poster.jpg", label: "Watch the film", alt: "Aerial film of Tomatin Distillery in the Highlands" },
};

// The live homepage has 11 timeline entries; the six below carry the story. The rest stay on the live site.
export const timeline = {
  eyebrow: "1897 to 2022",
  title: "Our *history*",
  items: [
    { year: "1897", title: "Our story begins", image: "/media/history/1897.webp", fit: "contain", w: 327, h: 480, alt: "The certificate of incorporation of the Tomatin Spey District Distillery",
      text: "In 1892 it was announced that the final route of the Highland Railway would pass through Tomatin. With this, local man John MacDougall, born and bred in Tomatin, began planning his distillery. The Tomatin Spey District Distillery was registered on 8th June 1897, however unfortunately it was closed in 1906." },
    { year: "1909", title: "It wasn’t closed for long", image: "/media/history/1909.webp", w: 785, h: 523, alt: "Distillery workers and their families, early twentieth century",
      text: "Luckily, the company was purchased by experienced wine and spirits merchants and reopened as the New Tomatin Distillers Company Ltd. in 1909, bringing the distillery back into operation with 2 stills capable of producing 225,000 litres of alcohol per year." },
    { year: "1974", title: "Boom in demand", image: "/media/history/1974.webp", w: 720, h: 480, alt: "A still and cask stamped Tomatin 1975",
      text: "Following the Second World War, demand for Scotch whisky boomed globally. To meet this demand new distilleries were built, closed distilleries reopened and established distilleries expanded, but nobody expanded to the same scale of Tomatin. By 1974 Tomatin had 23 stills capable of producing 12.5 million litres of alcohol per year, making it the largest malt distillery in the world." },
    { year: "1986", title: "The new chapter.", image: "/media/history/1986.webp", w: 720, h: 480, alt: "A bottle of King Whisky held in a hand",
      text: "As a result, it did not stay closed for long, and in February 1986 two Japanese companies, Takara Shuzo and Okura & Co., purchased the distillery to form the Tomatin Distillery Co. Ltd., of which Takara Shuzo proudly remains the majority shareholder to this day." },
    { year: "2002", title: "Quality over quantity.", image: "/media/history/2002.webp", w: 720, h: 480, alt: "A copper still inside Tomatin distillery",
      text: "We took the decision to remove some of our unused stills, reducing the total number from 23 to 12 (which remain in situ today) which marks the change in business focus from the mass production for the blended Scotch whisky market to growing our range of single malts." },
    { year: "2022", title: "To what matters.", image: "/media/history/2022.webp", fit: "contain", w: 480, h: 480, alt: "Distillery team at dusk beneath the words A journey shared",
      text: "The world has been through a lot in recent years, and we continue to face uncertainty and unrest. But with the unity we have seen from our partners around the world, the devotion from our team and growing support from our loyal customers, we are reminded of what really matters. Our people matter. Our community matters. Our product matters. So we raise a toast to you from Tomatin. To what matters." },
  ],
};

// Brand blurbs reuse phrases from the live homepage timeline; names and links come from the live navigation.
export const brands = {
  eyebrow: "Our brands",
  title: "Our *whisky*",
  cta: { label: "Discover Our Whisky", href: url("/tomatin/our-whisky/") },
  items: [
    { name: "Tomatin", tag: "Highland single malt", text: "Unpeated, light, soft and fruity.", href: url("/tomatin/"), image: "/media/brands/tomatin-2.webp", alt: "Inside Tomatin distillery, warm light on copper and casks", kind: "photo" },
    { name: "Cù Bòcan", tag: "Lightly peated single malt", text: "Focusing on unusual cask maturations, this brand has gone from strength to strength.", href: url("/cu-bocan/"), image: "/media/brands/cu-bocan.webp", alt: "Casks stamped Cù Bòcan", kind: "photo" },
    { name: "The Antiquary", tag: "Premium blended Scotch whisky", text: "Widening our brands portfolio since 1996.", href: url("/the-antiquary/"), image: "/media/brands/antiquary-2.webp", alt: "The Antiquary 21 Year Old bottle and box", kind: "photo" },
    { name: "Shirakawa", tag: "Japanese", text: "Uncover the Shirakawa story.", href: url("/shirakawa/"), image: "/media/brands/shirakawa.webp", alt: "Ink drawing of a Japanese garden and temple", kind: "line" },
  ],
};

export const recommendations = {
  eyebrow: "Shop",
  title: "Our *recommendations*",
  cta: { label: "Visit shop", href: url("/shop/") },
  items: [
    { size: "700ML", price: "£78.00", name: "Tomatin 14 Year Old Tawny Port", text: "The 14 year old single malt whisky is matured in a combination of Bourbon barrels and Port casks", image: "/media/bottles/14.png", href: url("/shop/core-range/14-year-old/") },
    { size: "700ML", price: "£126.00", name: "Tomatin 18 Year Old Oloroso Sherry", text: "The 18 year old dry single malt whisky enjoys its final maturation in Oloroso Sherry butts.", image: "/media/bottles/18.png", href: url("/shop/core-range/18-year-old/") },
    { size: "750ML", price: "", name: "Dualchas American Oak", text: "A malt whiskey matured in a combination of Bourbon barrels and Virgin Oak casks", image: "/media/bottles/dualchas.png", href: url("/shop/core-range/dualchas-american-oak/") },
    { size: "700ML", price: "£37.00", name: "Tomatin Legacy Bourbon and Virgin Oak", text: "A malt whisky matured in a combination of Bourbon barrels and Virgin Oak casks", image: "/media/bottles/legacy.png", href: url("/shop/core-range/legacy/") },
    { size: "700ML", price: "£49.00", name: "Tomatin 12 Year Old Triple Cask", text: "Triple wood maturation – use of ex-Bourbon, ex-Sherry and refill casks", image: "/media/bottles/12.png", href: url("/shop/core-range/12-year-old/") },
    { size: "700ML", price: "£62.50", name: "Tomatin Cask Strength Bourbon and Sherry", text: "Our Cask Strength is a first-fill whisky matured in a combination of Bourbon barrels and Sherry casks", image: "/media/bottles/cask-strength.png", href: url("/shop/core-range/cask-strength/") },
  ],
};

export const news = {
  eyebrow: "What's new",
  title: "The latest from the *Tomatin* Distillery",
  cta: { label: "See more", href: url("/news/") },
  items: [
    { date: "28 September 2026", iso: "2026-09-28", title: "Introducing Tomatin 2011 Single Cask – UK Exclusive", image: "/media/news/single-cask-2011.jpg", w: 2560, h: 1709, alt: "A bottle of Tomatin 2011 Single Cask on a wooden box beside a fire", href: url("/blog/whisky-lifestyle/introducing-tomatin-2011-single-cask-uk-exclusive/") },
    { date: "13 August 2026", iso: "2026-08-13", title: "Tomatin Distillery Tours: Discover the Perfect Whisky Experience near Inverness", image: "/media/news/tours.png", w: 940, h: 788, alt: "Aerial view of Tomatin Distillery in the Highlands", href: url("/blog/whisky-lifestyle/tomatin-distillery-tours-discover-the-perfect-whisky-experience-near-inverness/") },
    { date: "26 June 2026", iso: "2026-06-26", title: "An Award-Winning Month for Tomatin Whisky", image: "/media/news/awards.png", w: 1200, h: 630, alt: "Tomatin 10 Year Old with glasses of whisky and a gold medal", href: url("/blog/whisky-lifestyle/an-award-winning-month-for-tomatin-whisky/") },
  ],
};

export const footer = {
  title: "Subscribe",
  text: "Sign up to our mailing list to get Tomatin news and updates sent direct to your inbox",
  cta: { label: "Join the Tomatin Mailing List", href: url("/subscribe/") },
  followTitle: "Follow Us",
  followText: "For the latest content from Tomatin, follow us on our social media accounts",
  socials: [
    { name: "Facebook", href: "https://www.facebook.com/tomatin1897/", icon: "facebook" },
    { name: "Instagram", href: "https://www.instagram.com/tomatinwhisky/", icon: "instagram" },
    { name: "Twitter", href: "https://twitter.com/Tomatin1897", icon: "x" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/the-tomatin-group", icon: "linkedin" },
  ] as const,
  groups: [
    { title: "Our brands", links: [
      { label: "Tomatin", href: url("/tomatin/") },
      { label: "Cù Bòcan", href: url("/cu-bocan/") },
      { label: "The Antiquary", href: url("/the-antiquary/") },
      { label: "Shirakawa", href: url("/shirakawa/") },
    ] },
    { title: "About us", links: [{ label: "Our Story", href: "#story" }] },
    { title: "Resources", links: [
      { label: "News & Events", href: url("/news/") },
      { label: "Knowledgebase", href: "https://tomatin.sharepoint.com/sites/KnowledgeBase" },
      { label: "Contact Us", href: url("/contact-us/") },
    ] },
    { title: "Our shop", links: [
      { label: "Visit Shop", href: url("/shop/") },
      { label: "Delivery Terms", href: url("/website-terms-amp-conditions/") },
    ] },
  ],
  legal: [
    { label: "Terms & Conditions", href: url("/website-terms-amp-conditions/") },
    { label: "Cookie Policy", href: url("/cookie-policy/") },
  ],
  responsibly: "Please enjoy our whiskies responsibly",
  copyright: "© 2024 Tomatin Distillery Co Ltd",
  note: "This page is for people of legal drinking age.",
};
