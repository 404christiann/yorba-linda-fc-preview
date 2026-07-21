"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { hasFeature, type FeatureKey, type Tier } from "@/lib/tiers";

const TierContext = createContext<{ tier: Tier; setTier: (tier: Tier) => void } | null>(null);
const TIER_CHANGE_EVENT = "onzio:tier-change";

function tierFromUrl(): Tier {
  const value = new URLSearchParams(window.location.search).get("tier");
  return value === "starter" ? "starter" : "pro";
}

function subscribeToTier(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(TIER_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(TIER_CHANGE_EVENT, onStoreChange);
  };
}

export function TierProvider({ children }: { children: ReactNode }) {
  const tier = useSyncExternalStore(subscribeToTier, tierFromUrl, (): Tier => "pro");
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("tier");
    if (value && value !== "starter" && value !== "pro") {
      const url = new URL(window.location.href);
      url.searchParams.set("tier", "pro");
      window.history.replaceState({}, "", url);
    }
  }, []);
  const setTier = (next: Tier) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tier", next);
    window.history.replaceState({}, "", url);
    window.dispatchEvent(new Event(TIER_CHANGE_EVENT));
  };
  return <TierContext.Provider value={{ tier, setTier }}>{children}</TierContext.Provider>;
}

export function useTier() {
  const value = useContext(TierContext);
  if (!value) throw new Error("useTier must be used inside TierProvider");
  return value;
}
export function useHasFeature(feature: FeatureKey) { return hasFeature(useTier().tier, feature); }
