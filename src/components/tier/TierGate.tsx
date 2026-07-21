"use client";

import type { ReactNode } from "react";
import type { FeatureKey } from "@/lib/tiers";
import { useHasFeature } from "./TierProvider";

export function TierGate({ feature, children, fallback = null }: { feature: FeatureKey; children: ReactNode; fallback?: ReactNode }) {
  return useHasFeature(feature) ? children : fallback;
}
