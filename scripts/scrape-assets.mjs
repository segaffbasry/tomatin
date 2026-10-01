// Downloads every remote asset the homepage uses into public/. Re-run with `npm run scrape` to refresh.
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname } from "node:path";

const U = "https://tomatin.com/wp-content/uploads/";
const UA = { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" };
// [source, destination]. Full-size originals are tried first, sized variants are the fallback.
const files = [
  // fonts (brand fonts from their own @font-face rules)
  ["https://tomatin.wpenginepowered.com/wp-content/uploads/2023/12/set-sail-studios-goldney.ttf", "public/fonts/Goldney.ttf"],
  [U + "2024/06/Gordita-Regular.woff2", "public/fonts/Gordita-Regular.woff2"],
  [U + "2024/06/Gordita-Medium.woff2", "public/fonts/Gordita-Medium.woff2"],
  // brand
  [U + "2024/04/cropped-tomatin-icon-192x192.png", "public/brand/icon-192.png"],
  [U + "2024/04/cropped-tomatin-icon-180x180.png", "public/brand/apple-touch-icon.png"],
  // hero film (Wistia delivery of the homepage loop, 1280x720, 16s)
  ["https://embed.wistia.com/deliveries/c7b26be96a3a6e9a42d78f91097096444c214072.mp4", "public/media/hero/hero-original.mp4"],
  // After download, run scripts/trim-hero.sh to cut the dark opening and create the muted loop + poster.
  // aerial film used in the origins section (640x284, with audio)
  ["https://embed.wistia.com/deliveries/588d2bfb2a0ed857ae4b1440d303c7e68f3ada32.mp4", "public/media/film/aerial.mp4"],
  // history timeline
  [U + "2024/05/origins.webp", "public/media/history/origins.webp"],
  [U + "2024/03/Timeline-1897-copy.webp", "public/media/history/1897.webp"],
  [U + "2024/03/timeline-1909-copy.webp", "public/media/history/1909.webp"],
  [U + "2024/04/timeline-1974-copy.webp", "public/media/history/1974.webp"],
  [U + "2024/03/timeline-1986-new-chapter-copy.webp", "public/media/history/1986.webp"],
  [U + "2024/03/timeline-2002-copy.webp", "public/media/history/2002.webp"],
  [U + "2024/03/timeline-2022-TWM-copy-1.webp", "public/media/history/2022.webp"],
  // brands
  [U + "2023/11/7R405431-1-copy-768x512.webp", "public/media/brands/tomatin-2.webp"],
  [U + "2023/12/cu-bocan-matured-experimental-casks-2-copy.webp", "public/media/brands/cu-bocan.webp"],
  [U + "2024/06/ANTIQUARY_MASTER_BOTTLE_BOTTLE_SHOT_21YO_JPG-copy.webp", "public/media/brands/antiquary-2.webp"],
  [U + "2019/09/Shirakawa-Homepage-Story-1-1-copy.webp", "public/media/brands/shirakawa.webp"],
  // recommendations (bottle cut-outs)
  [U + "2024/01/14-AMcC-Bottle-130122.png", "public/media/bottles/14.png", U + "2024/01/14-AMcC-Bottle-130122-349x1024.png"],
  [U + "2024/01/18-AMcC-Bottle-130122.png", "public/media/bottles/18.png", U + "2024/01/18-AMcC-Bottle-130122-349x1024.png"],
  [U + "2024/01/Dulchas-AMcC-Bottle-130122.png", "public/media/bottles/dualchas.png", U + "2024/01/Dulchas-AMcC-Bottle-130122-349x1024.png"],
  [U + "2019/09/New-Legacy-Bottle-Only-Web.png", "public/media/bottles/legacy.png", U + "2019/09/New-Legacy-Bottle-Only-Web-600x1023.png"],
  [U + "2024/01/12-Bottle-Website.png", "public/media/bottles/12.png", U + "2024/01/12-Bottle-Website-349x1024.png"],
  [U + "2024/01/CS-AMcC-Bottle-130122-1.png", "public/media/bottles/cask-strength.png", U + "2024/01/CS-AMcC-Bottle-130122-1-349x1024.png"],
  // news (og:image of each post)
  [U + "2026/09/JJD_1007-scaled.jpg", "public/media/news/single-cask-2011.jpg"],
  [U + "2026/08/Untitled-Facebook-Post-26.png", "public/media/news/tours.png"],
  [U + "2026/06/LinkedInFB-10YO-Gold-1200-x-630-px-1.png", "public/media/news/awards.png"],
];

for (const [src, dest, fallback] of files) {
  try { await stat(dest); console.log("have", dest); continue; } catch {}
  let res = await fetch(src, { headers: UA });
  if (!res.ok && fallback) res = await fetch(fallback, { headers: UA });
  if (!res.ok) { console.error("FAIL", res.status, src); continue; }
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("ok  ", dest);
}
