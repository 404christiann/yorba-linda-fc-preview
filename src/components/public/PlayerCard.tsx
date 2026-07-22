"use client";

import Image from "next/image";
import { useState } from "react";
import type { Player } from "@/config/types";
import { prospect } from "@/config/prospect";
import { useHasFeature } from "@/components/tier/TierProvider";
import { NationalityFlag } from "./NationalityFlag";
import { RosterProfileModal } from "./RosterProfileModal";

const POSITION_LABELS = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
} as const;

function cardStats(player: Player) {
  if (!player.stats) return [];
  if (player.position === "GK") {
    return [
      ["Saves", player.stats.saves ?? 0],
      ["Clean sheets", player.stats.cleanSheets ?? 0],
      ["Minutes", player.stats.minutes],
    ] as const;
  }
  return [
    ["Goals", player.stats.goals],
    ["Assists", player.stats.assists],
    ["Minutes", player.stats.minutes],
  ] as const;
}

export function PlayerCard({ player, compact = false }: { player: Player; compact?: boolean }) {
  const hasProfiles = useHasFeature("expandedProfiles");
  const [modalOpen, setModalOpen] = useState(false);
  const isPlaceholder = !player.photo;
  const imageSrc = player.photo ?? prospect.branding.crest;
  const stats = cardStats(player);

  const cardContent = (
    <>
      <span className="player-card-media">
        <Image
          src={imageSrc}
          alt=""
          fill
          className={isPlaceholder ? "is-crest" : "is-photo"}
          sizes="(max-width: 640px) 50vw, (max-width: 1050px) 33vw, 25vw"
        />
      </span>
      <span className="player-card-identity">
        <span className="player-card-topline">
          <strong>{String(player.number).padStart(2, "0")}</strong>
          <NationalityFlag nationality={player.nationality}/>
        </span>
        <span className="player-card-name">
          <small>{player.firstName}</small>
          <strong>{player.lastName}</strong>
        </span>
        <span className="player-card-position">{POSITION_LABELS[player.position]}</span>
        {hasProfiles && stats.length > 0 && (
          <span className="player-card-stats" aria-hidden>
            {stats.map(([label, value]) => (
              <span key={label}><strong>{value.toLocaleString()}</strong><small>{label}</small></span>
            ))}
          </span>
        )}
        {hasProfiles && <span className="player-card-hint">View profile</span>}
      </span>
    </>
  );

  return (
    <>
      {hasProfiles ? (
        <button
          type="button"
          className={`player-card ${compact ? "compact" : ""}`}
          data-interactive="true"
          onClick={() => setModalOpen(true)}
          aria-label={`View ${player.firstName} ${player.lastName} profile`}
        >
          {cardContent}
        </button>
      ) : (
        <article className={`player-card ${compact ? "compact" : ""}`} data-interactive="false">
          {cardContent}
        </article>
      )}

      {modalOpen && (
        <RosterProfileModal player={player} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
