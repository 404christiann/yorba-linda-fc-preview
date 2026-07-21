"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { prospect } from "@/config/prospect";
import type { Fixture } from "@/config/types";
import { useMockData } from "@/lib/store/MockDataProvider";
import { useActiveTeam } from "@/components/layout/ActiveTeamProvider";
import { useHasFeature } from "@/components/tier/TierProvider";
import { ScheduleMatchCard } from "./ScheduleMatchCard";

type StatusFilter = "all" | Fixture["status"];

const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short" });
const monthHeading = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const monthKey = (date: string) => date.slice(0, 7);

function initialMonth(fixtures: Fixture[]) {
  return monthKey(fixtures.find((fixture) => fixture.status === "upcoming")?.date ?? fixtures.at(-1)?.date ?? new Date().toISOString());
}

export function ScheduleScreen() {
  const { fixtures, seasons } = useMockData();
  const { activeTeamId } = useActiveTeam();
  const canSelectSeason = useHasFeature("seasons");
  const prefersReducedMotion = useReducedMotion();
  const [seasonId, setSeasonId] = useState(prospect.currentSeasonId);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const seasonFixtures = useMemo(
    () => fixtures
      .filter((fixture) => fixture.teamId === activeTeamId && fixture.seasonId === seasonId)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [activeTeamId, fixtures, seasonId],
  );
  const [selectedMonth, setSelectedMonth] = useState(() => initialMonth(seasonFixtures));
  const months = useMemo(
    () => Array.from(new Set(seasonFixtures.map((fixture) => monthKey(fixture.date)))),
    [seasonFixtures],
  );
  const visibleFixtures = seasonFixtures.filter((fixture) => (
    monthKey(fixture.date) === selectedMonth
    && (statusFilter === "all" || fixture.status === statusFilter)
  ));
  const nextFixtureId = seasonFixtures.find((fixture) => fixture.status === "upcoming")?.id;

  function changeSeason(nextSeasonId: string) {
    setSeasonId(nextSeasonId);
    const nextFixtures = fixtures
      .filter((fixture) => fixture.teamId === activeTeamId && fixture.seasonId === nextSeasonId)
      .sort((a, b) => a.date.localeCompare(b.date));
    setSelectedMonth(initialMonth(nextFixtures));
  }

  return (
    <div className="schedule-calendar-page">
      <main className="schedule-calendar-shell">
        <header className="schedule-calendar-head">
          <div>
            <h1>Team schedule</h1>
          </div>
        </header>

        <div id="schedule-filters" className="schedule-filter-panel">
          <fieldset>
            <legend>Match status</legend>
            {(["all", "upcoming", "played"] as const).map((status) => (
              <button type="button" key={status} aria-pressed={statusFilter === status} data-active={statusFilter === status} onClick={() => setStatusFilter(status)}>
                {status === "all" ? "All matches" : status === "played" ? "Results" : "Upcoming"}
              </button>
            ))}
          </fieldset>
          {canSelectSeason && (
            <label>
              Season
              <select value={seasonId} onChange={(event) => changeSeason(event.target.value)}>
                {seasons.map((season) => <option key={season.id} value={season.id}>{season.label}</option>)}
              </select>
            </label>
          )}
        </div>

        <nav className="schedule-month-rail" aria-label="Schedule months">
          {months.map((month) => {
            const date = new Date(`${month}-02T12:00:00`);
            return (
              <button
                type="button"
                aria-pressed={selectedMonth === month}
                data-active={selectedMonth === month}
                key={month}
                onClick={() => setSelectedMonth(month)}
              >
                {monthLabel.format(date)}
              </button>
            );
          })}
        </nav>

        <section className="schedule-month-section">
          <div className="schedule-month-heading">
            <div>
              <span>{visibleFixtures.length} {visibleFixtures.length === 1 ? "match" : "matches"}</span>
              <h2>{monthHeading.format(new Date(`${selectedMonth}-02T12:00:00`))}</h2>
            </div>
            <small>{prospect.club.league}</small>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="schedule-card-grid"
              key={`${selectedMonth}-${statusFilter}-${seasonId}`}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {visibleFixtures.map((fixture, index) => (
                <motion.div
                  key={fixture.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.48, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ScheduleMatchCard fixture={fixture} isNext={fixture.id === nextFixtureId} />
                </motion.div>
              ))}
              {visibleFixtures.length === 0 && (
                <div className="schedule-empty">
                  <strong>No matches in this view.</strong>
                  <p>Choose another month or update the match-status filter.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
