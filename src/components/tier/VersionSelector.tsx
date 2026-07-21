"use client";

import { useState } from "react";
import { TIERS, TIER_LABELS } from "@/lib/tiers";
import { useTier } from "./TierProvider";

export function VersionSelector() {
  const { tier, setTier } = useTier();
  const [collapsed, setCollapsed] = useState(true);
  if (collapsed) return <button className="version-chip" onClick={() => setCollapsed(false)} aria-label="Open concept version selector"><span className="version-dot" aria-hidden/>Concept: {TIER_LABELS[tier]}</button>;
  return (
    <aside className="version-selector" aria-label="Concept version selector">
      <button className="version-close" onClick={() => setCollapsed(true)} aria-label="Collapse selector">×</button>
      <span>Concept version</span>
      <div role="group" aria-label="Choose concept version">
        {TIERS.map((item) => <button key={item} data-active={tier === item} onClick={() => setTier(item)}>{TIER_LABELS[item]}</button>)}
      </div>
    </aside>
  );
}
