"use client";

import Link from "next/link";
import { prospect } from "@/config/prospect";
import { useMockData } from "@/lib/store/MockDataProvider";
import { ScheduleMatchCard } from "./ScheduleMatchCard";

export function MatchAreaScreen({ fixtureId }: { fixtureId: string }) {
  const { fixtures } = useMockData();
  const fixture = fixtures.find((item) => item.id === fixtureId);

  if (!fixture) {
    return (
      <main className="match-area-page match-area-empty">
        <h1>Match not found.</h1>
        <Link href="/schedule">Return to the calendar</Link>
      </main>
    );
  }

  return (
    <main className="match-area-page">
      <div className="match-area-shell">
        <Link className="match-area-back" href="/schedule">← Team schedule</Link>
        <header className="match-area-head">
          <span className="eyebrow">{fixture.status === "upcoming" ? "Next match" : "Match report"}</span>
          <h1>{fixture.status === "upcoming" ? "Match area" : "Full time"}</h1>
        </header>
        <div className="match-area-layout">
          <ScheduleMatchCard fixture={fixture} showAction={false} />
          <aside className="match-area-notes">
            <span>Match information</span>
            <h2>{fixture.competition}</h2>
            <dl>
              <div><dt>Setting</dt><dd>{fixture.homeAway === "home" ? "Home" : "Away"}</dd></div>
              <div><dt>Venue</dt><dd>{fixture.venue}</dd></div>
              {fixture.result?.attendance && <div><dt>Attendance</dt><dd>{fixture.result.attendance.toLocaleString()}</dd></div>}
            </dl>
            {fixture.result?.scorers?.length ? (
              <div className="match-area-scorers"><span>{prospect.club.shortName} scorers</span><p>{fixture.result.scorers.join(" · ")}</p></div>
            ) : (
              <p className="match-area-copy">Matchday updates and final details will appear here as kickoff approaches.</p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
