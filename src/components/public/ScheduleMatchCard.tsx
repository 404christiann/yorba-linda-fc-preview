import Image from "next/image";
import Link from "next/link";
import type { Fixture } from "@/config/types";
import { prospect } from "@/config/prospect";

const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "America/New_York" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

function opponentInitials(name: string) {
  return name.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
}

export function ScheduleMatchCard({ fixture, isNext = false, showAction = true }: { fixture: Fixture; isNext?: boolean; showAction?: boolean }) {
  const date = new Date(fixture.date);
  const clubIsHome = fixture.homeAway === "home";
  const result = fixture.result;
  const outcome = result
    ? result.clubScore > result.opponentScore ? "W" : result.clubScore < result.opponentScore ? "L" : "D"
    : null;
  const homeName = clubIsHome ? prospect.club.shortName : fixture.opponent;
  const awayName = clubIsHome ? fixture.opponent : prospect.club.shortName;

  return (
    <article className="schedule-match-card">
      <div className="schedule-match-stage">
        <div className="schedule-match-team">
          {clubIsHome ? (
            <span className="schedule-match-crest"><Image src={prospect.branding.crestOnDark ?? prospect.branding.crest} alt="" fill sizes="84px" /></span>
          ) : <span className="schedule-opponent-mark">{opponentInitials(fixture.opponent)}</span>}
          <strong>{homeName}</strong>
        </div>
        <div className="schedule-match-center">
          {result ? (
            <strong>{clubIsHome ? result.clubScore : result.opponentScore}<span>–</span>{clubIsHome ? result.opponentScore : result.clubScore}</strong>
          ) : (
            <><strong>{timeFormat.format(date)}</strong><span>Kickoff</span></>
          )}
        </div>
        <div className="schedule-match-team">
          {clubIsHome ? <span className="schedule-opponent-mark">{opponentInitials(fixture.opponent)}</span> : (
            <span className="schedule-match-crest"><Image src={prospect.branding.crestOnDark ?? prospect.branding.crest} alt="" fill sizes="84px" /></span>
          )}
          <strong>{awayName}</strong>
        </div>
      </div>
      <div className="schedule-match-details">
        <div className="schedule-match-kicker">
          <span>{fixture.competition ?? prospect.club.league}</span>
          {outcome && <b data-outcome={outcome}>{outcome === "W" ? "Win" : outcome === "L" ? "Loss" : "Draw"}</b>}
          {!outcome && <b>{fixture.homeAway}</b>}
        </div>
        <h3>{fixture.homeAway === "home" ? "Home match" : "Away match"}</h3>
        <dl>
          <div><dt>Date</dt><dd>{dateFormat.format(date)} · {timeFormat.format(date)}</dd></div>
          <div><dt>Venue</dt><dd>{fixture.venue}</dd></div>
        </dl>
        {showAction && (
          <Link className="schedule-match-action" href={`/schedule/${fixture.id}`}>
            <span aria-hidden>⋮</span>
            {isNext ? "Go to next match" : "Match area"}
            <b aria-hidden>→</b>
          </Link>
        )}
      </div>
    </article>
  );
}
