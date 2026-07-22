"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { prospect } from "@/config/prospect";
import { TierGate } from "@/components/tier/TierGate";
import { useMockData } from "@/lib/store/MockDataProvider";

function teamMark(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

type SortKey = "gp" | "w" | "d" | "l" | "gd" | "points";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "gp", label: "GP" },
  { key: "w", label: "W" },
  { key: "d", label: "D" },
  { key: "l", label: "L" },
  { key: "gd", label: "GD" },
  { key: "points", label: "Points" },
];

export function StandingsTable() {
  const { standings } = useMockData();
  const prefersReducedMotion = useReducedMotion();
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const ranked = useMemo(() => {
    const officialOrder = [...standings].sort((a, b) => b.points - a.points || b.gd - a.gd);
    const rankById = new Map(officialOrder.map((row, index) => [row.id, index + 1]));
    return officialOrder.map((row) => ({ ...row, rank: rankById.get(row.id) ?? 0 }));
  }, [standings]);

  const displayed = useMemo(() => {
    const dir = sortDir === "desc" ? -1 : 1;
    return [...ranked].sort((a, b) => (a[sortKey] - b[sortKey]) * dir || b.points - a.points || b.gd - a.gd);
  }, [ranked, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (!prospect.standings || displayed.length === 0) return null;

  return (
    <TierGate feature="standings">
      <section className="standings-home" id="standings">
        <header className="section-heading">
          <div>
            <span className="eyebrow">League standings</span>
            <h2>{prospect.standings.competitionName}</h2>
          </div>
        </header>
        {prospect.standings.intro && <p className="standings-intro">{prospect.standings.intro}</p>}
        <div className="standings-table">
          <div className="standings-row header">
            <span className="standings-team-header"><span className="standings-rank">#</span>Team</span>
            {COLUMNS.map((column) => (
              <button
                key={column.key}
                type="button"
                className="standings-sort"
                data-active={sortKey === column.key}
                onClick={() => handleSort(column.key)}
                aria-label={`Sort by ${column.label}`}
              >
                {column.label}
                {sortKey === column.key && <span className="standings-sort-arrow" aria-hidden>{sortDir === "desc" ? "▼" : "▲"}</span>}
              </button>
            ))}
          </div>
          {displayed.map((row) => (
            <motion.div
              layout
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
              className={`standings-row${row.teamName === prospect.club.name ? " is-club" : ""}`}
              key={row.id}
            >
              <span className="standings-team">
                <span className="standings-rank">{row.rank}</span>
                {row.teamLogo ? (
                  <Image src={row.teamLogo} alt="" width={28} height={28} />
                ) : (
                  <span className="standings-team-mark">{teamMark(row.teamName)}</span>
                )}
                <strong>{row.teamName}</strong>
              </span>
              <span>{row.gp}</span>
              <span>{row.w}</span>
              <span>{row.d}</span>
              <span>{row.l}</span>
              <span>{row.gd > 0 ? `+${row.gd}` : row.gd}</span>
              <span>{row.points}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </TierGate>
  );
}
