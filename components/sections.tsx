import Image from "next/image";
import { A, Button, Logo, Rich, Social, TextLink } from "@/components/ui";
import { brandIcons } from "@/lib/brand-icons";
import { footer, news, recommendations } from "@/lib/content";

/* Every section declares its ground with `data-tone` (dark or light). The header and its text follow it. */

export function Recommendations() {
  return (
    <section id="recommendations" className="section tone-sand" data-tone="light" aria-labelledby="recs-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-reveal="label">{recommendations.eyebrow}</p>
            <h2 className="h2" id="recs-title" data-reveal="heading"><Rich text={recommendations.title} /></h2>
          </div>
          <div data-reveal="label"><TextLink href={recommendations.cta.href}>{recommendations.cta.label}</TextLink></div>
        </div>
        <ul className="rec-grid">
          {recommendations.items.map((r) => (
            <li key={r.name} className="rec-card" data-reveal="card">
              <A href={r.href} className="rec-bottle" label={r.name}><Image src={r.image} alt="" width={325} height={900} sizes="(max-width: 620px) 40vw, 18vw" /></A>
              <div className="rec-meta"><span>{r.size}</span><span>{r.price}</span></div>
              <h3>{r.name}</h3>
              <p>{r.text}</p>
              <TextLink href={r.href} label={`Find out more: ${r.name}`}>Find out more</TextLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function News() {
  return (
    <section id="news" className="section tone-cream" data-tone="light" data-fast aria-labelledby="news-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-reveal="label">{news.eyebrow}</p>
            <h2 className="h2" id="news-title" data-reveal="heading"><Rich text={news.title} /></h2>
          </div>
          <div data-reveal="label"><TextLink href={news.cta.href}>{news.cta.label}</TextLink></div>
        </div>
        <div className="news-layout">
          {news.items.slice(0, 1).map((n) => (
            <article key={n.href} className="news-feature" data-reveal="card">
              <A href={n.href} label={n.title} className="news-feature-pic"><div className="frame" data-image><Image src={n.image} alt={n.alt} fill sizes="(max-width: 900px) 92vw, 50vw" /></div></A>
              <div className="news-feature-body">
                <time dateTime={n.iso}>{n.date}</time>
                <h3 className="statement statement--sm"><A href={n.href}>{n.title}</A></h3>
                <TextLink href={n.href} label={`Read the article: ${n.title}`}>Read the article</TextLink>
              </div>
            </article>
          ))}
          <ul className="news-list">
            {news.items.slice(1).map((n) => (
              <li key={n.href} className="news-row" data-reveal="card">
                <A href={n.href} label={n.title} className="news-thumb"><div className="frame"><Image src={n.image} alt={n.alt} fill sizes="(max-width: 620px) 40vw, 200px" /></div></A>
                <div>
                  <time dateTime={n.iso}>{n.date}</time>
                  <h3><A href={n.href}>{n.title}</A></h3>
                  <TextLink href={n.href} label={`Read the article: ${n.title}`}>Read the article</TextLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="section tone-navy" data-tone="dark" data-fast>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="eyebrow" data-reveal="label">{footer.title}</p>
            <h2 className="h2" data-reveal="heading">{footer.text}</h2>
            <div data-reveal="label"><Button href={footer.cta.href} tone="solid">{footer.cta.label}</Button></div>
          </div>
          <div className="footer-follow" data-reveal="para">
            <h3>{footer.followTitle}</h3>
            <p>{footer.followText}</p>
            <div className="socials">
              {footer.socials.map((s) => <A key={s.name} href={s.href} label={s.name}><Social path={brandIcons[s.icon]} name={s.name} /></A>)}
            </div>
          </div>
        </div>
        <div className="footer-cols">
          <div><Logo /></div>
          {footer.groups.map((g) => (
            <div key={g.title}>
              <h3>{g.title}</h3>
              <ul>{g.links.map((l) => <li key={l.label}><A href={l.href}>{l.label}</A></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-legal">
          <nav aria-label="Legal">{footer.legal.map((l) => <A key={l.label} href={l.href}>{l.label}</A>)}</nav>
          <p>{footer.responsibly}. {footer.note}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
