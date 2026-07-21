"use client";

import { TierGate } from "@/components/tier/TierGate";
import { FeatureUnavailableNote } from "@/components/layout/FeatureUnavailableNote";
import { useMockData } from "@/lib/store/MockDataProvider";

/* Display labels only — the Sponsor.level data values ("title" | "gold" | "partner") are load-bearing and unchanged. */
const TIER_DISPLAY = { title: ["01", "Title partner"], gold: ["02", "Premier partners"], partner: ["03", "Club partners"] } as const;

export function SponsorsScreen() {
  const { sponsors } = useMockData();
  return <TierGate feature="sponsors" fallback={<FeatureUnavailableNote title="Our partners"/>}><div className="interior"><header className="interior-hero"><span className="eyebrow">Club partners</span><h1>Backing the badge.<br/><em>Building the city.</em></h1></header><section className="sponsor-tiers">{(["title","gold","partner"] as const).map((level) => { const tierSponsors = sponsors.filter((s) => s.level === level); return <div key={level}><div className="group-title"><span>{TIER_DISPLAY[level][0]}</span><h2>{TIER_DISPLAY[level][1]}</h2><small>{tierSponsors.length} {tierSponsors.length === 1 ? "partner" : "partners"}</small></div><div className={`sponsor-grid ${level}`}>{tierSponsors.map((sponsor) => <article key={sponsor.id}><strong>{sponsor.name}</strong>{sponsor.blurb && <p>“{sponsor.blurb}”</p>}</article>)}</div></div>; })}</section></div></TierGate>;
}
