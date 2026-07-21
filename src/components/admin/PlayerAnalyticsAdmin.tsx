"use client";

import { useState } from "react";
import Image from "next/image";
import { prospect } from "@/config/prospect";
import type { Player, PlayerSeasonStats, Position } from "@/config/types";
import { useMockData } from "@/lib/store/MockDataProvider";

type PositionFilter = "ALL" | Position;

const FILTERS: Array<{ value: PositionFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "GK", label: "Goalkeepers" },
  { value: "DF", label: "Defenders" },
  { value: "MF", label: "Midfielders" },
  { value: "FW", label: "Forwards" },
];

const POSITION_LABELS: Record<Position, string> = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
};

type Metric = {
  label: string;
  value: number;
  average: number;
  normalized: number;
  averageNormalized: number;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function disciplineScore(stats: PlayerSeasonStats) {
  return Math.max(0, 100 - stats.yellowCards * 15 - stats.redCards * 30);
}

function metricValue(stats: PlayerSeasonStats, label: string) {
  switch (label) {
    case "Saves":
      return stats.saves ?? 0;
    case "Clean sheets":
      return stats.cleanSheets ?? 0;
    case "Goals":
      return stats.goals;
    case "Assists":
      return stats.assists;
    case "Starts":
      return stats.starts;
    case "Minutes":
      return stats.minutes;
    case "Discipline":
      return disciplineScore(stats);
    default:
      return 0;
  }
}

function buildMetrics(player: Player, peers: Player[]): Metric[] {
  const stats = player.stats ?? {
    appearances: 0,
    starts: 0,
    minutes: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  };
  const labels =
    player.position === "GK"
      ? ["Saves", "Clean sheets", "Starts", "Minutes", "Discipline"]
      : ["Goals", "Assists", "Starts", "Minutes", "Discipline"];
  const peerStats = peers.map(
    (peer) =>
      peer.stats ?? {
        appearances: 0,
        starts: 0,
        minutes: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      },
  );

  return labels.map((label) => {
    const value = metricValue(stats, label);
    const peerValues = peerStats.map((item) => metricValue(item, label));
    const cohortAverage = average(peerValues);
    const maximum = Math.max(...peerValues, value, 1);
    return {
      label,
      value,
      average: cohortAverage,
      normalized: Math.round((value / maximum) * 100),
      averageNormalized: Math.round((cohortAverage / maximum) * 100),
    };
  });
}

function buildTrend(player: Player, opponents: string[]) {
  const stats = player.stats;
  const total =
    player.position === "GK"
      ? (stats?.saves ?? 0)
      : (stats?.goals ?? 0) + (stats?.assists ?? 0);
  const base = total / Math.max(stats?.appearances ?? opponents.length, 1);
  return opponents.map((opponent, index) => {
    const rhythm = ((player.number + index * 2) % 5) - 2;
    return {
      opponent,
      value: Math.max(0, Math.round(base + rhythm * (player.position === "GK" ? 0.7 : 0.35))),
    };
  });
}

function PlayerRail({
  players,
  selectedId,
  onSelect,
}: {
  players: Player[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="analytics-player-rail" aria-label="Select player">
      {players.map((player) => {
        const selected = player.id === selectedId;
        return (
          <button
            key={player.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(player.id)}
          >
            <span className="analytics-player-avatar">
              <Image
                src={player.photo ?? prospect.branding.crest}
                alt=""
                width={48}
                height={48}
                className={player.photo ? "person" : "crest"}
              />
            </span>
            <span>
              <strong>
                {player.firstName} {player.lastName}
              </strong>
              <small>
                #{player.number} · {player.position}
              </small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function RadarProfile({ metrics }: { metrics: Metric[] }) {
  const center = 110;
  const radius = 72;
  const point = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const distance = radius * (value / 100);
    return [
      center + distance * Math.cos(angle),
      center + distance * Math.sin(angle),
    ];
  };
  const polygon = (key: "normalized" | "averageNormalized") =>
    metrics.map((metric, index) => point(index, metric[key]).join(",")).join(" ");

  return (
    <section className="analytics-card analytics-radar-card">
      <header>
        <div>
          <span>Player profile</span>
          <h2>Performance shape</h2>
        </div>
        <div className="analytics-legend" aria-label="Chart legend">
          <span><i />Player</span>
          <span><i />Position average</span>
        </div>
      </header>
      <div className="analytics-radar-layout">
        <svg viewBox="0 0 220 220" role="img" aria-label="Player performance compared with the position average">
          {[25, 50, 75, 100].map((level) => (
            <polygon
              key={level}
              points={metrics
                .map((_, index) => point(index, level).join(","))
                .join(" ")}
              className="radar-grid"
            />
          ))}
          {metrics.map((metric, index) => {
            const [x, y] = point(index, 100);
            return <line key={metric.label} x1={center} y1={center} x2={x} y2={y} className="radar-grid" />;
          })}
          <polygon points={polygon("averageNormalized")} className="radar-average" />
          <polygon points={polygon("normalized")} className="radar-player" />
          {metrics.map((metric, index) => {
            const [x, y] = point(index, metric.normalized);
            return <circle key={metric.label} cx={x} cy={y} r="3.5" className="radar-point" />;
          })}
        </svg>
        <div className="analytics-radar-values">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <i>
                <b style={{ width: `${metric.normalized}%` }} />
                <em style={{ left: `${metric.averageNormalized}%` }} />
              </i>
              <strong>{metric.normalized}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CohortComparison({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="analytics-card analytics-comparison">
      <header>
        <div>
          <span>Cohort comparison</span>
          <h2>Vs position average</h2>
        </div>
      </header>
      <div className="comparison-bars">
        {metrics.slice(0, 4).map((metric) => {
          const scale = Math.max(metric.value, metric.average, 1);
          return (
            <div key={metric.label}>
              <div>
                <strong>{metric.label}</strong>
                <small>{metric.value.toLocaleString()} / {Math.round(metric.average).toLocaleString()} avg</small>
              </div>
              <i><b style={{ width: `${(metric.value / scale) * 100}%` }} /></i>
              <i className="average"><b style={{ width: `${(metric.average / scale) * 100}%` }} /></i>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MatchTrend({
  player,
  opponents,
}: {
  player: Player;
  opponents: string[];
}) {
  const trend = buildTrend(player, opponents);
  const maximum = Math.max(...trend.map((point) => point.value), 1);
  const coordinates = trend.map((point, index) => ({
    ...point,
    x: trend.length === 1 ? 300 : 30 + (index / (trend.length - 1)) * 540,
    y: 130 - (point.value / maximum) * 94,
  }));

  return (
    <section className="analytics-card analytics-trend">
      <header>
        <div>
          <span>Recent matches</span>
          <h2>{player.position === "GK" ? "Saves per match" : "Goal contributions per match"}</h2>
        </div>
        <small>Illustrative preview data</small>
      </header>
      <svg viewBox="0 0 600 160" role="img" aria-label="Recent player performance trend">
        {[36, 83, 130].map((y) => <line key={y} x1="30" y1={y} x2="570" y2={y} className="trend-grid" />)}
        <polyline points={coordinates.map((point) => `${point.x},${point.y}`).join(" ")} className="trend-line" />
        {coordinates.map((point) => (
          <g key={point.opponent}>
            <circle cx={point.x} cy={point.y} r="5" className="trend-point" />
            <text x={point.x} y="153" textAnchor="middle">{point.opponent.split(" ")[0]}</text>
          </g>
        ))}
      </svg>
    </section>
  );
}

export function PlayerAnalyticsAdmin() {
  const store = useMockData();
  const [filter, setFilter] = useState<PositionFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string>("");
  const players = store.players.filter(
    (player) => player.teamId === prospect.defaultTeamId,
  );
  const filteredPlayers =
    filter === "ALL"
      ? players
      : players.filter((player) => player.position === filter);
  const player =
    filteredPlayers.find((item) => item.id === selectedId) ??
    filteredPlayers[0];

  if (!player) {
    return (
      <div className="admin-page">
        <header className="admin-page-header">
          <div>
            <span>Performance</span>
            <h1>Analytics</h1>
            <p>Add players and statistics to unlock performance analysis.</p>
          </div>
        </header>
      </div>
    );
  }

  const peers = players.filter((item) => item.position === player.position);
  const metrics = buildMetrics(player, peers);
  const stats = player.stats;
  const kpis = metrics.slice(0, 4);
  const seasonLabel =
    store.seasons.find((season) => season.id === prospect.currentSeasonId)?.label ??
    "Current season";
  const opponents = store.fixtures
    .filter(
      (fixture) =>
        fixture.teamId === prospect.defaultTeamId &&
        fixture.seasonId === prospect.currentSeasonId &&
        fixture.status === "played",
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-6)
    .map((fixture) => fixture.opponent);
  const discipline = stats ? disciplineScore(stats) : 100;

  return (
    <div className="admin-page player-analytics-page">
      <header className="admin-page-header analytics-page-header">
        <div>
          <span>Performance</span>
          <h1>Analytics</h1>
          <p>{seasonLabel} · Player performance dashboard</p>
        </div>
        <span className="analytics-sample-chip">Sample data</span>
      </header>

      <div className="analytics-position-filters" aria-label="Filter analytics by position">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="player-analytics-layout">
        <PlayerRail
          players={filteredPlayers}
          selectedId={player.id}
          onSelect={setSelectedId}
        />

        <div className="player-analytics-dashboard" key={player.id}>
          <section className="analytics-player-hero">
            <span className="analytics-hero-avatar">
              <Image
                src={player.photo ?? prospect.branding.crest}
                alt=""
                width={96}
                height={96}
                className={player.photo ? "person" : "crest"}
              />
            </span>
            <div>
              <h2>{player.firstName} {player.lastName}</h2>
              <p>{POSITION_LABELS[player.position]} · #{player.number} · {seasonLabel}</p>
            </div>
            <strong aria-hidden="true">{player.number}</strong>
          </section>

          <div className="analytics-kpi-grid">
            {kpis.map((metric) => {
              const difference = metric.value - metric.average;
              return (
                <article key={metric.label}>
                  <strong>{metric.value.toLocaleString()}</strong>
                  <span>{metric.label}</span>
                  <small>
                    {difference > 0
                      ? `+${Math.round(difference)} vs position avg`
                      : `Position avg ${Math.round(metric.average)}`}
                  </small>
                </article>
              );
            })}
          </div>

          <div className="analytics-chart-grid">
            <RadarProfile metrics={metrics} />
            <CohortComparison metrics={metrics} />
          </div>

          <MatchTrend player={player} opponents={opponents} />

          <section className="analytics-card analytics-discipline">
            <header>
              <div>
                <span>Availability</span>
                <h2>Discipline</h2>
              </div>
              <strong data-score={discipline >= 85 ? "clean" : discipline >= 60 ? "caution" : "risk"}>
                {discipline >= 85 ? "Clean" : discipline >= 60 ? "Caution" : "High risk"} · {discipline}/100
              </strong>
            </header>
            <div>
              <p><i className="yellow" /><b>{stats?.yellowCards ?? 0}</b><span>Yellow</span></p>
              <p><i className="red" /><b>{stats?.redCards ?? 0}</b><span>Red</span></p>
              <div><i><b style={{ width: `${discipline}%` }} /></i></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
