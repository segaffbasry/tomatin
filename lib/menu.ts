import { url } from "@/lib/content";

// Full-screen menu. `#` targets scroll to a homepage section through Lenis; everything else opens the live site.
export const menu = {
  primary: [
    { label: "Our story", href: "#story" },
    { label: "Our history", href: "#history" },
    { label: "Our whisky", href: "#brands" },
    { label: "Recommendations", href: "#recommendations" },
    { label: "News", href: "#news" },
  ],
  live: [
    { label: "Tours", href: url("/tours/") },
    { label: "Shop", href: url("/shop/") },
    { label: "Whisky Picker", href: url("/whiskypicker/") },
    { label: "Our Environment", href: url("/our-environment/") },
  ],
  brands: [
    { label: "Tomatin", href: url("/tomatin/") },
    { label: "Cù Bòcan", href: url("/cu-bocan/") },
    { label: "The Antiquary", href: url("/the-antiquary/") },
    { label: "Shirakawa", href: url("/shirakawa/") },
  ],
  contact: { label: "Contact Us", href: url("/contact-us/") },
};

export const isExternal = (href: string) => /^https?:/.test(href);
