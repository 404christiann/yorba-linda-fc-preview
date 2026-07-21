import type { Fixture } from "@/config/types";
import { prospect } from "@/config/prospect";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export function FixtureRow({ fixture, featured = false }: { fixture: Fixture; featured?: boolean }) {
  const date = new Date(fixture.date);
  const outcome = fixture.result ? fixture.result.clubScore > fixture.result.opponentScore ? "W" : fixture.result.clubScore < fixture.result.opponentScore ? "L" : "D" : null;
  return <article className={`fixture-row ${featured ? "featured" : ""}`}><div className="fixture-date"><strong>{dateFormat.format(date)}</strong><span>{timeFormat.format(date)}</span></div><div className="fixture-opponent"><small>{fixture.homeAway === "home" ? "Home" : "Away"} · {fixture.competition}</small><h3>{fixture.opponent}</h3><p>{fixture.venue}</p></div>{fixture.result ? <div className="fixture-score"><span data-outcome={outcome}>{outcome}</span><strong>{fixture.result.clubScore}–{fixture.result.opponentScore}</strong></div> : <div className="fixture-vs">{prospect.club.initials} <span>vs</span> {fixture.opponent.split(" ").map((word) => word[0]).join("").slice(0,3)}</div>}</article>;
}
