"use client";

import { MotionConfig } from "framer-motion";
import { prospect } from "@/config/prospect";
import { MockDataProvider } from "@/lib/store/MockDataProvider";
import { TierProvider } from "@/components/tier/TierProvider";
import { VersionSelector } from "@/components/tier/VersionSelector";
import { ActiveTeamProvider } from "@/components/layout/ActiveTeamProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user"><TierProvider><MockDataProvider config={prospect}><ActiveTeamProvider>{children}<VersionSelector /></ActiveTeamProvider></MockDataProvider></TierProvider></MotionConfig>;
}
