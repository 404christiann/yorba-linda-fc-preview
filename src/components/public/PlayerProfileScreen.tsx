"use client";

import Link from "next/link";
import { TierGate } from "@/components/tier/TierGate";
import { FeatureUnavailableNote } from "@/components/layout/FeatureUnavailableNote";
import { useMockData } from "@/lib/store/MockDataProvider";

export function PlayerProfileScreen({ playerId }: { playerId: string }) {
  const { players } = useMockData(); const player = players.find((item) => item.id === playerId);
  if (!player) return <div className="unavailable"><h1>Player not found</h1><Link href="/roster">Back to roster</Link></div>;
  return <TierGate feature="expandedProfiles" fallback={<FeatureUnavailableNote title="Expanded player profiles"/>}><div className="profile-page"><Link href="/roster" className="back-link">← Back to roster</Link><header><div className="profile-number">{player.number}</div><div><span className="eyebrow">{player.position} · First team</span><h1>{player.firstName}<br/><em>{player.lastName}</em></h1><p>{player.hometown} · {player.height} · Joined {player.yearJoined}</p></div></header><section><div><span className="eyebrow">Player bio</span><h2>About {player.firstName}</h2><p>{player.bio}</p></div>{player.stats && <aside><span className="eyebrow">Season stats</span><div>{Object.entries(player.stats).slice(0,6).map(([label,value]) => <p key={label}><span>{label.replace(/([A-Z])/g," $1")}</span><strong>{value}</strong></p>)}</div></aside>}</section></div></TierGate>;
}
