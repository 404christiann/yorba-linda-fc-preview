"use client";

import Image from "next/image";
import { useState } from "react";
import type { StaffMember } from "@/config/types";
import { prospect } from "@/config/prospect";
import { useHasFeature } from "@/components/tier/TierProvider";
import { RosterProfileModal } from "./RosterProfileModal";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 3);
}

export function StaffCard({ member }: { member: StaffMember }) {
  const hasProfiles = useHasFeature("expandedProfiles");
  const [modalOpen, setModalOpen] = useState(false);
  const imageSrc = member.photo ?? prospect.branding.crest;
  const isPlaceholder = !member.photo;

  const content = (
    <>
      <span className="staff-card-media">
        <Image
          src={imageSrc}
          alt=""
          fill
          className={isPlaceholder ? "is-crest" : "is-photo"}
          sizes="(max-width: 640px) 50vw, (max-width: 1050px) 33vw, 25vw"
        />
      </span>
      <span className="staff-card-copy">
        <span className="staff-card-name">{member.name}</span>
        <span className="staff-card-role"><b>{initials(member.name)}</b>{member.role}</span>
        {hasProfiles && <span className="staff-card-hint">View profile</span>}
      </span>
    </>
  );

  return (
    <>
      {hasProfiles ? (
        <button
          type="button"
          className="staff-card"
          data-interactive="true"
          onClick={() => setModalOpen(true)}
          aria-label={`View ${member.name} profile`}
        >
          {content}
        </button>
      ) : (
        <article className="staff-card" data-interactive="false">{content}</article>
      )}

      {modalOpen && (
        <RosterProfileModal member={member} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
