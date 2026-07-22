"use client";

import Link from "next/link";
import Image from "next/image";
import { prospect } from "@/config/prospect";
import type { FeatureKey } from "@/lib/tiers";
import { useHasFeature, useTier } from "@/components/tier/TierProvider";
import { FeatureUnavailableNote } from "@/components/layout/FeatureUnavailableNote";
import { nextId, useMockData } from "@/lib/store/MockDataProvider";
import { RosterAdmin } from "./RosterAdmin";
import { ScheduleAdmin } from "./ScheduleAdmin";
import { PlayerAnalyticsAdmin } from "./PlayerAnalyticsAdmin";
import { StandingsAdmin } from "./StandingsAdmin";

export type AdminKind = "dashboard"|"roster"|"schedule"|"seasons"|"stats"|"sponsors"|"store"|"analytics"|"standings";
const REQUIRED: Partial<Record<AdminKind,FeatureKey>> = { seasons:"seasons",stats:"stats",sponsors:"sponsors",store:"store",analytics:"analytics",standings:"standings" };

export function AdminScreen({ kind }: { kind: AdminKind }) {
  const feature = REQUIRED[kind];
  const allowed = useHasFeature(feature ?? "contentControls");
  if (feature && !allowed) return <div className="admin-page"><FeatureUnavailableNote title={kind[0].toUpperCase()+kind.slice(1)}/></div>;
  return <AdminContent kind={kind}/>;
}

function PageHeader({ eyebrow, title, copy, action, onAction }: { eyebrow: string; title: string; copy: string; action?: string; onAction?: () => void }) {
  return <header className="admin-page-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{action && <button onClick={onAction}><span>+</span>{action}</button>}</header>;
}

function AdminContent({ kind }: { kind: AdminKind }) {
  const store = useMockData(); const { tier } = useTier(); const hasSeasons = useHasFeature("seasons"); const hasStats = useHasFeature("stats"); const hasStandings = useHasFeature("standings") && !!prospect.standings;
  const firstPlayers = store.players.filter((p)=>p.teamId===prospect.defaultTeamId); const upcoming = store.fixtures.filter((f)=>f.teamId===prospect.defaultTeamId && f.status==="upcoming").sort((a,b)=>a.date.localeCompare(b.date)); const played = store.fixtures.filter((f)=>f.teamId===prospect.defaultTeamId && f.status==="played").sort((a,b)=>b.date.localeCompare(a.date));
  if (kind === "dashboard") return <div className="admin-page"><PageHeader eyebrow="Club operations" title="Dashboard" copy={`${prospect.seasons.find((season)=>season.id===prospect.currentSeasonId)?.label ?? "Active season"} · ${prospect.club.shortName}`}/><div className="admin-stat-grid dashboard"><article><span>Players</span><strong>{firstPlayers.length}</strong><small>{firstPlayers.length} of {tier==="starter"?"22":"30"} profiles</small><i style={{width:`${Math.min(100,firstPlayers.length/(tier==="starter"?22:30)*100)}%`}}/></article><article><span>Staff</span><strong>{store.staff.length}</strong><small>Active team members</small></article><article><span>Matches</span><strong>{upcoming.length+played.length}</strong><small>Current season</small></article><article className="next-match-stat"><span>Next match</span><strong>{upcoming[0] ? new Date(upcoming[0].date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "TBD"}</strong><small>{upcoming[0] ? `vs ${upcoming[0].opponent}` : "Add a fixture"}</small></article></div><section className="admin-quick-section"><div className="panel-heading"><div><span>Quick actions</span><h2>Club operations</h2></div></div><div className="quick-actions">{hasStats&&<Link href="/admin/stats"><span className="quick-icon">▥</span><strong>Enter match stats</strong><small>Log goals, assists, saves and minutes.</small></Link>}{hasSeasons&&<Link href="/admin/seasons"><span className="quick-icon">□</span><strong>Manage seasons</strong><small>Create or change the active season.</small></Link>}{hasStandings&&<Link href="/admin/standings"><span className="quick-icon">⊞</span><strong>Manage standings</strong><small>Add, edit, or remove teams in the league table.</small></Link>}<Link href="/admin/roster"><span className="quick-icon">＋</span><strong>Manage roster</strong><small>Add, update, or remove player profiles.</small></Link><Link href="/admin/schedule"><span className="quick-icon">▦</span><strong>Manage schedule</strong><small>Add fixtures and publish final results.</small></Link></div></section><button className="reset-data" onClick={()=>store.dispatch({type:"reset",state:store.initial})}>Reset sample data</button></div>;
  if (kind === "roster") return <RosterAdmin/>;
  if (kind === "schedule") return <ScheduleAdmin/>;
  if (kind === "standings") return <StandingsAdmin/>;
  if (kind === "seasons") return <div className="admin-page"><PageHeader eyebrow="Competition settings" title="Seasons" copy="Organize fixtures and player numbers by campaign." action="Start new season" onAction={()=>store.dispatch({type:"season/add",season:{id:`s${2025+store.seasons.length}`,label:`${2025+store.seasons.length} Season`,status:"upcoming"}})}/><section className="admin-panel entity-panel">{store.seasons.map((season)=><div className="admin-entity" key={season.id}><span className="entity-avatar">⊙</span><div><strong>{season.label}</strong><small>Fixtures and performance records</small></div><span className={`status-chip ${season.status}`}>{season.status}</span></div>)}</section></div>;
  if (kind === "stats") return <div className="admin-page"><PageHeader eyebrow="Performance" title="Player statistics" copy="Edit the numbers supporters see on player profiles."/><section className="admin-panel entity-panel">{firstPlayers.map((player)=><div className="admin-entity" key={player.id}><span className="entity-avatar">{player.number}</span><div><strong>{player.firstName} {player.lastName}</strong><small>{player.stats?.appearances ?? 0} apps · {player.stats?.goals ?? 0} goals · {player.stats?.assists ?? 0} assists</small></div><button onClick={()=>store.dispatch({type:"player/update",player:{...player,stats:{...player.stats!,goals:(player.stats?.goals??0)+1}}})}>+ Goal</button></div>)}</section></div>;
  if (kind === "sponsors") return <div className="admin-page"><PageHeader eyebrow="Commercial" title="Sponsors" copy="Manage the partners presented across the club site." action="Add sample partner" onAction={()=>store.dispatch({type:"sponsor/add",sponsor:{id:nextId("s",store.sponsors.map((s)=>s.id)),name:"New Community Partner",logo:"/prospect/sponsors/s06.svg",level:"partner"}})}/><section className="admin-panel entity-panel">{store.sponsors.map((sponsor)=><div className="admin-entity" key={sponsor.id}><span className="sponsor-thumb"><Image src={sponsor.logo} alt="" width={110} height={42}/></span><div><strong>{sponsor.name}</strong><small>{sponsor.level} partner</small></div><button onClick={()=>store.dispatch({type:"sponsor/remove",id:sponsor.id})}>Remove</button></div>)}</section></div>;
  if (kind === "store") return <div className="admin-page"><PageHeader eyebrow="Commerce preview" title="Team store" copy="Showcase products while the club receives payments directly." action="Add sample product" onAction={()=>store.dispatch({type:"product/add",product:{id:nextId("prod",store.products.map((p)=>p.id)),name:`${prospect.club.initials} Matchday Tote`,price:24,image:"/prospect/store/scarf.svg",category:"accessory"}})}/><section className="commerce-note"><span>✓</span><div><strong>Club-owned checkout</strong><p>Products connect to the club’s own payment account on the live platform.</p></div></section><section className="admin-panel entity-panel">{store.products.map((product)=><div className="admin-entity" key={product.id}><span className="product-thumb"><Image src={product.image} alt="" width={58} height={58}/></span><div><strong>{product.name}</strong><small>${product.price} · {product.category}</small></div><button onClick={()=>store.dispatch({type:"product/remove",id:product.id})}>Remove</button></div>)}</section></div>;
  if (kind === "analytics") return <PlayerAnalyticsAdmin />;
  return null;
}
