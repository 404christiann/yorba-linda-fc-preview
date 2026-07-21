"use client";

import { useTier } from "@/components/tier/TierProvider";

export function FeatureUnavailableNote({ title }: { title: string }) {
  const { setTier } = useTier();
  return <div className="unavailable"><span>Concept version</span><h1>{title}</h1><p>This view is part of the Pro version of the concept.</p><button onClick={() => setTier("pro")}>Switch to Pro</button></div>;
}
