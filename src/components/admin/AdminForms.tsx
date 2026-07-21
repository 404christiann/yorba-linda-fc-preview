"use client";

import { useState, type FormEvent } from "react";
import { prospect } from "@/config/prospect";
import type {
  Fixture,
  MatchResult,
  Player,
  Position,
  StaffMember,
} from "@/config/types";

type PlayerFormProps = {
  onSave: (player: Omit<Player, "id">) => void;
  onCancel?: () => void;
  initial?: Player;
};

export function PlayerForm({ onSave, onCancel, initial }: PlayerFormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [number, setNumber] = useState(initial?.number ?? 0);
  const [position, setPosition] = useState<Position>(initial?.position ?? "MF");
  const [hometown, setHometown] = useState(
    initial?.hometown ?? `${prospect.club.city}, ${prospect.club.state}`,
  );
  const [height, setHeight] = useState(initial?.height ?? "");
  const [yearJoined, setYearJoined] = useState(initial?.yearJoined ?? 2026);
  const [bio, setBio] = useState(initial?.bio ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      teamId: initial?.teamId ?? prospect.defaultTeamId,
      firstName,
      lastName,
      number,
      position,
      photo: initial?.photo,
      hometown,
      height: height || undefined,
      yearJoined,
      bio: bio || undefined,
      stats: initial?.stats ?? {
        appearances: 0,
        starts: 0,
        minutes: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      },
    });
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          First name
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Jordan"
          />
        </label>
        <label>
          Last name
          <input
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Lee"
          />
        </label>
        <label>
          Squad number
          <input
            required
            min="1"
            max="99"
            type="number"
            value={number || ""}
            onChange={(event) => setNumber(Number(event.target.value))}
          />
        </label>
        <label>
          Position
          <select
            value={position}
            onChange={(event) => setPosition(event.target.value as Position)}
          >
            <option>GK</option>
            <option>DF</option>
            <option>MF</option>
            <option>FW</option>
          </select>
        </label>
        <label>
          Hometown
          <input
            value={hometown}
            onChange={(event) => setHometown(event.target.value)}
            placeholder={`${prospect.club.city}, ${prospect.club.state}`}
          />
        </label>
        <label>
          Height
          <input
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="6 ft 1 in"
          />
        </label>
        <label>
          Year joined
          <input
            min="2000"
            max="2100"
            type="number"
            value={yearJoined}
            onChange={(event) => setYearJoined(Number(event.target.value))}
          />
        </label>
      </div>
      <label>
        Player bio
        <textarea
          rows={4}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Player background and story"
        />
      </label>
      <label className="file-field">
        Player photo
        <input type="file" />
        <span>Choose image</span>
        <small>Photo uploads work on the live platform.</small>
      </label>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button>{initial ? "Save changes" : "Save player"}</button>
      </div>
    </form>
  );
}

type StaffFormProps = {
  onSave: (staff: Omit<StaffMember, "id">) => void;
  onCancel?: () => void;
  initial?: StaffMember;
};

export function StaffForm({ onSave, onCancel, initial }: StaffFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          name,
          role,
          teamId: initial?.teamId ?? prospect.defaultTeamId,
          photo: initial?.photo,
          bio: bio || undefined,
        });
      }}
    >
      <label>
        Full name
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Taylor Morgan"
        />
      </label>
      <label>
        Role
        <input
          required
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="Assistant Coach"
        />
      </label>
      <label>
        Staff bio
        <textarea
          rows={4}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Staff background and responsibilities"
        />
      </label>
      <label className="file-field">
        Staff photo
        <input type="file" />
        <span>Choose image</span>
        <small>Photo uploads work on the live platform.</small>
      </label>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button>{initial ? "Save changes" : "Save staff member"}</button>
      </div>
    </form>
  );
}

export function FixtureForm({
  onSave,
  onCancel,
  initial,
}: {
  onSave: (fixture: Omit<Fixture, "id">) => void;
  onCancel?: () => void;
  initial?: Fixture;
}) {
  const initialDate = initial
    ? new Date(
        new Date(initial.date).getTime() -
          new Date(initial.date).getTimezoneOffset() * 60_000,
      )
        .toISOString()
        .slice(0, 16)
    : "2026-09-19T19:00";
  const [opponent, setOpponent] = useState(initial?.opponent ?? "");
  const [date, setDate] = useState(initialDate);
  const [venue, setVenue] = useState(
    initial?.venue ?? prospect.club.venue ?? "",
  );
  const [homeAway, setHomeAway] = useState<"home" | "away">(
    initial?.homeAway ?? "home",
  );
  const [competition, setCompetition] = useState(
    initial?.competition ?? prospect.club.league,
  );

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          teamId: initial?.teamId ?? prospect.defaultTeamId,
          seasonId: initial?.seasonId ?? prospect.currentSeasonId,
          opponent,
          date: new Date(date).toISOString(),
          venue,
          homeAway,
          competition,
          status: initial?.status ?? "upcoming",
          result: initial?.result,
        });
      }}
    >
      <label>
        Opponent
        <input
          required
          value={opponent}
          onChange={(event) => setOpponent(event.target.value)}
          placeholder="Sound City FC"
        />
      </label>
      <div className="form-grid">
        <label>
          Kickoff
          <input
            required
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label>
          Home or away
          <select
            value={homeAway}
            onChange={(event) =>
              setHomeAway(event.target.value as "home" | "away")
            }
          >
            <option value="home">Home</option>
            <option value="away">Away</option>
          </select>
        </label>
      </div>
      <label>
        Venue
        <input
          required
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
        />
      </label>
      <label>
        Competition
        <input
          required
          value={competition}
          onChange={(event) => setCompetition(event.target.value)}
        />
      </label>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button>{initial ? "Save changes" : "Save fixture"}</button>
      </div>
    </form>
  );
}

export function ResultForm({
  fixture,
  onSave,
  onCancel,
}: {
  fixture: Fixture;
  onSave: (result: MatchResult) => void;
  onCancel?: () => void;
}) {
  const [clubScore, setClubScore] = useState(
    fixture.result?.clubScore ?? 0,
  );
  const [opponentScore, setOpponentScore] = useState(
    fixture.result?.opponentScore ?? 0,
  );

  return (
    <form
      className="admin-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          clubScore,
          opponentScore,
          scorers:
            fixture.result?.scorers ??
            (clubScore ? ["Sample scorer 58'"] : []),
          attendance: fixture.result?.attendance,
          note: fixture.result?.note,
        });
      }}
    >
      <div className="result-title">
        <strong>{prospect.club.shortName}</strong>
        <span>vs</span>
        <strong>{fixture.opponent}</strong>
      </div>
      <div className="score-inputs">
        <input
          aria-label={`${prospect.club.shortName} score`}
          min="0"
          type="number"
          value={clubScore}
          onChange={(event) => setClubScore(Number(event.target.value))}
        />
        <span>–</span>
        <input
          aria-label="Opponent score"
          min="0"
          type="number"
          value={opponentScore}
          onChange={(event) => setOpponentScore(Number(event.target.value))}
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button>{fixture.result ? "Save result" : "Record result"}</button>
      </div>
    </form>
  );
}
