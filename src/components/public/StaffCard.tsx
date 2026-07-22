"use client";

import Image from "next/image";
import { useState } from "react";
import type { StaffMember } from "@/config/types";
import { prospect } from "@/config/prospect";
import { useHasFeature } from "@/components/tier/TierProvider";
import { NationalityFlag } from "./NationalityFlag";
import { RosterProfileModal } from "./RosterProfileModal";

function roleInitials(role: string) {
  return role.split(" ").map((part) => part[0]).join("").slice(0, 3);
}

export function StaffCard({ member }: { member: StaffMember }) {
  const hasProfiles = useHasFeature("expandedProfiles");
  const [modalOpen, setModalOpen] = useState(false);
  const imageSrc = member.photo ?? prospect.branding.crest;
  const isPlaceholder = !member.photo;
  const [firstName, ...rest] = member.name.split(" ");
  const lastName = rest.join(" ");

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
        <span className="staff-card-topline">
          <span className="staff-card-name">
            <small>{firstName}</small>
            <strong>{lastName}</strong>
          </span>
          <NationalityFlag nationality={member.nationality}/>
        </span>
        <span className="staff-card-role"><b>{roleInitials(member.role)}</b>{member.role}</span>
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
