"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMockData } from "@/lib/store/MockDataProvider";
import { useActiveTeam } from "@/components/layout/ActiveTeamProvider";
import type { Position } from "@/config/types";
import { PlayerCard } from "./PlayerCard";
import { StaffCard } from "./StaffCard";

const GROUPS: Array<[Position, string, string]> = [
  ["GK", "Goalkeepers", "goalkeepers"],
  ["DF", "Defenders", "defenders"],
  ["MF", "Midfielders", "midfielders"],
  ["FW", "Forwards", "forwards"],
];

type RosterFilter = "all" | Position | "staff";

export function RosterScreen() {
  const { players, staff } = useMockData();
  const { activeTeamId } = useActiveTeam();
  const [filter, setFilter] = useState<RosterFilter>("all");
  const prefersReducedMotion = useReducedMotion();
  const teamPlayers = players.filter((player) => player.teamId === activeTeamId);
  const teamStaff = staff.filter((member) => !member.teamId || member.teamId === activeTeamId);
  const visibleGroups = GROUPS.filter(([position]) => filter === "all" || filter === position);
  const resultLabel = filter === "all"
    ? "All squad"
    : filter === "staff"
      ? "Technical staff"
      : GROUPS.find(([position]) => position === filter)?.[1] ?? "Squad";

  return (
    <div className="roster-page">
      <div className="roster-filter-bar">
        <label htmlFor="roster-filter">Filter roster</label>
        <select
          id="roster-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value as RosterFilter)}
        >
          <option value="all">All squad</option>
          {GROUPS.map(([position, label]) => (
            <option value={position} key={position}>{label}</option>
          ))}
          <option value="staff">Technical staff</option>
        </select>
      </div>

      <div className="roster-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="roster-filter-results"
            key={filter}
            aria-label={`Showing ${resultLabel}`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, clipPath: "inset(0 0 7% 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, clipPath: "inset(0 0 5% 0)" }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {!prefersReducedMotion && (
              <motion.span
                className="roster-filter-flash"
                aria-hidden
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ scaleX: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, opacity: { delay: 0.3, duration: 0.18 } }}
              />
            )}

            {visibleGroups.map(([position, label, anchor], groupIndex) => {
              const group = teamPlayers.filter((player) => player.position === position);
              return (
                <motion.section
                  className="roster-group"
                  id={anchor}
                  key={position}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: groupIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="roster-group-heading">
                    <h2>{label}</h2>
                    <small>{group.length} {group.length === 1 ? "player" : "players"}</small>
                  </div>
                  <div className="roster-grid">
                    {group.map((player) => (
                      <motion.div
                        className="roster-filter-card"
                        key={player.id}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.975 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <PlayerCard player={player} />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            })}

            {(filter === "all" || filter === "staff") && (
              <motion.section
                className="staff-section"
                id="staff"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: visibleGroups.length * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="staff-section-intro">
                  <h2>Technical<br/><em>staff.</em></h2>
                </div>
                <div className="staff-grid">
                  {teamStaff.map((member) => (
                    <motion.div
                      className="roster-filter-card"
                      key={member.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.975 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <StaffCard member={member} />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
