export type Tier = "starter" | "pro";
export const TIERS: Tier[] = ["starter", "pro"];
export const TIER_LABELS: Record<Tier, string> = { starter: "Starter", pro: "Pro" };
const TIER_RANK: Record<Tier, number> = { starter: 0, pro: 1 };

export type FeatureKey =
  | "sponsors" | "stats" | "expandedProfiles" | "store" | "seasons" | "analytics" | "contentControls";

const FEATURE_MIN_TIER: Record<FeatureKey, Tier> = {
  sponsors: "pro", stats: "pro", expandedProfiles: "pro", store: "pro", seasons: "pro", analytics: "pro", contentControls: "pro",
};

export function hasFeature(tier: Tier, feature: FeatureKey): boolean {
  return TIER_RANK[tier] >= TIER_RANK[FEATURE_MIN_TIER[feature]];
}

export const TIER_LIMITS: Record<Tier, { playerProfiles: string; photoUploads: string; note: string }> = {
  starter: { playerProfiles: "Up to 22", photoUploads: "Up to 40", note: "Included with initial onboarding" },
  pro: { playerProfiles: "Up to 30", photoUploads: "Up to 120", note: "Included with initial onboarding" },
};
