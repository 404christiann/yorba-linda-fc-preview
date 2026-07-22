"use client";

import Image from "next/image";
import Link from "next/link";
import { prospect } from "@/config/prospect";
import { TierGate } from "@/components/tier/TierGate";
import { useMockData } from "@/lib/store/MockDataProvider";
import { useActiveTeam } from "@/components/layout/ActiveTeamProvider";
import { MatchdaySlideshow } from "@/components/public/MatchdaySlideshow";
import { StandingsTable } from "@/components/public/StandingsTable";

const matchDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const matchTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function initials(name: string) {
  return name.split(" ").map((word) => word[0]).join("").slice(0, 3);
}

export function HomeScreen() {
  const { fixtures, sponsors, products } = useMockData();
  const { activeTeamId } = useActiveTeam();
  const teamFixtures = fixtures.filter((fixture) => fixture.teamId === activeTeamId);
  const next = [...teamFixtures].filter((f) => f.status === "upcoming").sort((a,b) => a.date.localeCompare(b.date))[0];
  const latest = [...teamFixtures].filter((f) => f.status === "played").sort((a,b) => b.date.localeCompare(a.date))[0];
  const featuredKits = products.filter((product) => product.category === "jersey").slice(0, 3);

  return <>
    <section className="hero">
      <div className="hero-content">
        <div className="hero-copy">
          <h1><span>{prospect.copy.home.heroHeadline[0]}</span><em>{prospect.copy.home.heroHeadline[1]}</em></h1>
          <p className="hero-intro">{prospect.copy.home.heroIntro}</p>
          <div className="hero-cta"><Link href="/schedule">Next match</Link><Link href="/roster">Meet the squad</Link></div>
        </div>
        <div className="hero-media" aria-label={`${prospect.club.name} crest`}>
          <Image
            className="hero-crest"
            src={prospect.branding.crest}
            alt={`${prospect.club.name} crest`}
            width={720}
            height={712}
            preload
            sizes="(max-width: 800px) 78vw, 42vw"
          />
        </div>
      </div>
    </section>

    {next && <section className="match-feature">
      <header className="match-feature-head"><span className="eyebrow">Next match</span><p>{next.competition}</p></header>
      <div className="match-stage">
        <div className="match-side match-club">
          <Image src={prospect.branding.crest} alt={`${prospect.club.name} crest`} width={220} height={218}/>
          <strong>{prospect.club.shortName}</strong>
        </div>
        <div className="match-center"><span>VS</span><p>{next.homeAway === "home" ? "Home" : "Away"}</p></div>
        <div className="match-side match-opponent"><span aria-hidden>{initials(next.opponent)}</span><strong>{next.opponent}</strong></div>
      </div>
      <div className="match-meta">
        <p><small>Date</small><strong>{matchDateFormat.format(new Date(next.date))}</strong></p>
        <p><small>Kickoff</small><strong>{matchTimeFormat.format(new Date(next.date))}</strong></p>
        <p><small>Venue</small><strong>{next.venue}</strong></p>
      </div>
      <footer className="match-feature-foot">
        {latest?.result && <p><small>Latest result</small><strong>{prospect.club.initials} {latest.result.clubScore}—{latest.result.opponentScore} {initials(latest.opponent)}</strong><span>{latest.opponent}</span></p>}
        <Link href="/schedule">Full schedule →</Link>
      </footer>
    </section>}

    <TierGate feature="sponsors"><section className="partner-home"><header className="partner-home-head"><span className="eyebrow">Proudly supported by</span><Link href="/sponsors" className="partner-cta">Get involved</Link></header><div className="partner-marquee"><div className="partner-track">{[...sponsors, ...sponsors].map((sponsor, index) => <span className="partner-logo" key={`${sponsor.id}-${index}`}><Image src={sponsor.logo} alt={sponsor.name} width={260} height={80}/></span>)}</div></div></section></TierGate>

    <StandingsTable />

    <MatchdaySlideshow />

    <TierGate feature="store"><section className="kit-home">
      <header className="kit-home-head">
        <div>
          <span className="eyebrow">{prospect.copy.home.collectionEyebrow}</span>
          <h2>{prospect.copy.home.collectionHeadline[0]}<br/><em>{prospect.copy.home.collectionHeadline[1]}</em></h2>
        </div>
        <div className="kit-home-intro">
          <p>{prospect.copy.home.collectionIntro}</p>
          <Link href="/store">Shop the collection</Link>
        </div>
      </header>
      <div className="kit-collection" role="list" aria-label={`${prospect.club.name} merchandise`}>
        {featuredKits.map((product, index) => <Link href="/store" className="kit-product" data-kit={index + 1} role="listitem" key={product.id}>
          <div className="kit-product-media"><Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 82vw, 34vw"/></div>
          <div className="kit-product-meta">
            <span><small>{prospect.copy.home.collectionItemLabel}</small><strong>{product.name}</strong></span>
            <span className="kit-product-price">${product.price}</span>
          </div>
        </Link>)}
      </div>
    </section></TierGate>

    {prospect.branding.recruitImage && (
      <section className="recruit-cta">
        <Image
          className="recruit-cta-image"
          src={prospect.branding.recruitImage}
          alt={prospect.branding.recruitImageAlt ?? ""}
          fill
          sizes="100vw"
        />
        <div className="recruit-cta-content">
          <h2>{prospect.copy.home.recruitHeadline[0]}<br/><em>{prospect.copy.home.recruitHeadline[1]}</em></h2>
          <p>{prospect.copy.home.recruitIntro}</p>
          <Link href="/club#contact" className="recruit-cta-button">{prospect.copy.home.recruitButtonLabel}</Link>
        </div>
      </section>
    )}
  </>;
}
