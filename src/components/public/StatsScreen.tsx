"use client";

import { useState } from "react";
import { TierGate } from "@/components/tier/TierGate";
import { FeatureUnavailableNote } from "@/components/layout/FeatureUnavailableNote";
import { useMockData } from "@/lib/store/MockDataProvider";
import { useActiveTeam } from "@/components/layout/ActiveTeamProvider";

type SortKey = "goals" | "assists" | "appearances" | "minutes";
export function StatsScreen() {
  const { players, fixtures } = useMockData(); const { activeTeamId } = useActiveTeam(); const [sort, setSort] = useState<SortKey>("goals");
  const teamPlayers = players.filter((p) => p.teamId === activeTeamId && p.stats).sort((a,b) => (b.stats?.[sort] ?? 0) - (a.stats?.[sort] ?? 0));
  const played = fixtures.filter((f) => f.teamId === activeTeamId && f.status === "played" && f.result); const wins = played.filter((f) => f.result!.clubScore > f.result!.opponentScore).length; const draws = played.filter((f) => f.result!.clubScore === f.result!.opponentScore).length;
  const gf = played.reduce((sum,f) => sum + f.result!.clubScore, 0), ga = played.reduce((sum,f) => sum + f.result!.opponentScore, 0);
  return <TierGate feature="stats" fallback={<FeatureUnavailableNote title="Team statistics"/>}><div className="interior"><header className="interior-hero"><span className="eyebrow">Numbers behind the ninety</span><h1>Form.<br/><em>Measured.</em></h1></header><section className="stat-overview"><div><span>Record</span><strong>{wins}–{draws}–{played.length-wins-draws}</strong></div><div><span>Goals for</span><strong>{gf}</strong></div><div><span>Goals against</span><strong>{ga}</strong></div><div><span>Clean sheets</span><strong>{played.filter((f) => f.result!.opponentScore === 0).length}</strong></div></section><section className="stats-table-wrap"><div className="section-heading"><div><span className="eyebrow">Player leaders</span><h2>2026 performance</h2></div><label>Sort by<select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}><option value="goals">Goals</option><option value="assists">Assists</option><option value="appearances">Appearances</option><option value="minutes">Minutes</option></select></label></div><div className="stats-table"><div className="stats-row header"><span>Player</span><span>Apps</span><span>Goals</span><span>Assists</span><span>Min</span></div>{teamPlayers.map((p) => <div className="stats-row" key={p.id}><span><strong>{p.firstName} {p.lastName}</strong><small>{p.position} · #{p.number}</small></span><span>{p.stats!.appearances}</span><span>{p.stats!.goals}</span><span>{p.stats!.assists}</span><span>{p.stats!.minutes.toLocaleString("en-US")}</span></div>)}</div></section></div></TierGate>;
}
