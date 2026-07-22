"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Player, StaffMember } from "@/config/types";
import { prospect } from "@/config/prospect";
import { NationalityFlag } from "./NationalityFlag";

type Props =
  | { player: Player; member?: never; onClose: () => void }
  | { member: StaffMember; player?: never; onClose: () => void };

const POSITION_LABELS = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
} as const;

function roleInitials(role: string) {
  return role.split(" ").map((part) => part[0]).join("").slice(0, 3);
}

export function RosterProfileModal({ player, member, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const personName = player ? `${player.firstName} ${player.lastName}` : member.name;
  const imageSrc = player?.photo ?? member?.photo ?? prospect.branding.crest;
  const isPlaceholder = player ? !player.photo : !member.photo;
  const nationality = player?.nationality ?? member?.nationality;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="roster-modal-layer" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="roster-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="roster-modal-title"
      >
        <div className="roster-modal-media">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            className={isPlaceholder ? "is-crest" : "is-photo"}
            sizes="(max-width: 640px) 100vw, 520px"
          />
          <span className="roster-modal-fade" aria-hidden/>
          <span className="roster-modal-mark" aria-hidden>
            {player ? player.number : roleInitials(member.role)}
          </span>
          <button ref={closeRef} type="button" onClick={onClose} className="roster-modal-close" aria-label="Close profile">
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="roster-modal-body">
          <div className="roster-modal-heading">
            <div>
              <span>{player ? POSITION_LABELS[player.position] : member.role}</span>
              <h2 id="roster-modal-title">{personName}</h2>
            </div>
            <NationalityFlag nationality={nationality}/>
          </div>

          {player ? <PlayerDetails player={player} /> : <StaffDetails member={member} />}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function PlayerDetails({ player }: { player: Player }) {
  const stats = player.stats;
  return (
    <>
      <div className="roster-modal-meta">
        <Meta label="Squad number" value={String(player.number)} />
        <Meta label="Hometown" value={player.hometown ?? prospect.copy.fallbacks.playerHometown} />
        <Meta label="Height" value={player.height ?? "—"} />
        <Meta label="Joined" value={player.yearJoined ? String(player.yearJoined) : "—"} />
      </div>

      {player.bio && <p className="roster-modal-bio">{player.bio}</p>}

      {stats && (
        <div className="roster-modal-stats">
          <div className="roster-modal-section-title"><span>2026 season</span><strong>Key statistics</strong></div>
          <div>
            <Stat label="Appearances" value={stats.appearances} />
            <Stat label="Starts" value={stats.starts} />
            <Stat label="Minutes" value={stats.minutes} />
            {player.position === "GK" ? (
              <>
                <Stat label="Saves" value={stats.saves ?? 0} />
                <Stat label="Clean sheets" value={stats.cleanSheets ?? 0} />
                <Stat label="Cards" value={stats.yellowCards + stats.redCards} />
              </>
            ) : (
              <>
                <Stat label="Goals" value={stats.goals} />
                <Stat label="Assists" value={stats.assists} />
                <Stat label="Cards" value={stats.yellowCards + stats.redCards} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function StaffDetails({ member }: { member: StaffMember }) {
  return (
    <>
      <div className="roster-modal-meta staff-meta">
        <Meta label="Role" value={member.role} />
        <Meta label="Club" value={prospect.club.shortName} />
      </div>
      <p className="roster-modal-bio">
        {member.bio ?? prospect.copy.fallbacks.staffBio.replace("{name}", member.name)}
      </p>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <p><span>{label}</span><strong>{value}</strong></p>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <p><strong>{value.toLocaleString()}</strong><span>{label}</span></p>;
}
