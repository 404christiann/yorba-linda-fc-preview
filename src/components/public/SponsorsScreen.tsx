"use client";

import { useState } from "react";
import Image from "next/image";
import { prospect } from "@/config/prospect";
import { TierGate } from "@/components/tier/TierGate";
import { FeatureUnavailableNote } from "@/components/layout/FeatureUnavailableNote";
import { useMockData } from "@/lib/store/MockDataProvider";

/* Display labels only — the Sponsor.level data values ("title" | "gold" | "partner") are load-bearing and unchanged. */
const TIER_DISPLAY = { title: ["01", "Title partner"], gold: ["02", "Premier partners"], partner: ["03", "Club partners"] } as const;

export function SponsorsScreen() {
  const [notice, setNotice] = useState(false);
  const { sponsors } = useMockData();
  const tiers = (["title", "gold", "partner"] as const)
    .map((level) => ({ level, sponsors: sponsors.filter((s) => s.level === level) }))
    .filter((tier) => tier.sponsors.length > 0);
  const flat = tiers.length <= 1;

  return <TierGate feature="sponsors" fallback={<FeatureUnavailableNote title="Our partners"/>}><div className="interior sponsors-page">
    <section className="involved involved-first">
      {flat ? (
        <div className="partner-marquee"><div className="partner-track">
          {[...sponsors, ...sponsors].map((sponsor, index) => <span className="partner-logo" key={`${sponsor.id}-${index}`}><Image src={sponsor.logo} alt={sponsor.name} width={220} height={64}/></span>)}
        </div></div>
      ) : (
        <div className="sponsor-tiers">{tiers.map(({ level, sponsors: tierSponsors }) => (
          <div key={level}>
            <div className="group-title"><span>{TIER_DISPLAY[level][0]}</span><h2>{TIER_DISPLAY[level][1]}</h2><small>{tierSponsors.length} {tierSponsors.length === 1 ? "partner" : "partners"}</small></div>
            <div className={`sponsor-grid ${level}`}>
              {tierSponsors.map((sponsor) => <article key={sponsor.id}>
                <Image src={sponsor.logo} alt={sponsor.name} width={160} height={48}/>
                {sponsor.blurb && <p>“{sponsor.blurb}”</p>}
              </article>)}
            </div>
          </div>
        ))}</div>
      )}

      <div className="involved-intro">
        <span className="eyebrow">Take the first step</span>
        <h2>We’ll take care<br/><em>of the rest.</em></h2>
      </div>
      <div className="involved-grid">
        <div className="involved-info">
          <div>
            <h3>Find us here</h3>
            <p>{prospect.contact.address}</p>
          </div>
          <div>
            <h3>Get in touch</h3>
            {prospect.contact.phone && <a href={`tel:${prospect.contact.phone.replace(/[^\d+]/g, "")}`}>{prospect.contact.phone}</a>}
            <a href={`mailto:${prospect.contact.email}`}>{prospect.contact.email}</a>
          </div>
          {prospect.contact.trainingHours && <div>
            <h3>Training hours</h3>
            {prospect.contact.trainingHours.map((row) => <p key={row.label}><span>{row.label}</span> {row.hours}</p>)}
          </div>}
        </div>
        <form className="involved-form" onSubmit={(e) => { e.preventDefault(); setNotice(true); }}>
          <label>Name<input required placeholder="Your name"/></label>
          <label>Email<input required type="email" placeholder="you@example.com"/></label>
          <label>Message<textarea required rows={4} placeholder="How would you like to get involved?"/></label>
          <button>Send</button>
          <p role="status">{notice ? "Concept preview — messages aren’t sent from this demo." : "Messages are not sent from this concept preview."}</p>
        </form>
      </div>
    </section>
  </div></TierGate>;
}
