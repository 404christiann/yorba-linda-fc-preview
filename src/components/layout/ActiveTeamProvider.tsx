"use client";

import { createContext, useContext, type ReactNode } from "react";
import { prospect } from "@/config/prospect";

const TeamContext = createContext<{ activeTeamId: string } | null>(null);
export function ActiveTeamProvider({ children }: { children: ReactNode }) {
  return <TeamContext.Provider value={{ activeTeamId: prospect.defaultTeamId }}>{children}</TeamContext.Provider>;
}
export function useActiveTeam() {
  const value = useContext(TeamContext);
  if (!value) throw new Error("useActiveTeam must be used inside ActiveTeamProvider");
  return value;
}
