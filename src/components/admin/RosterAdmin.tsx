"use client";

import { useState } from "react";
import Image from "next/image";
import { prospect } from "@/config/prospect";
import type { Player, StaffMember } from "@/config/types";
import { TIER_LIMITS } from "@/lib/tiers";
import { nextId, useMockData } from "@/lib/store/MockDataProvider";
import { useTier } from "@/components/tier/TierProvider";
import { AdminDrawer } from "./AdminDrawer";
import { PlayerForm, StaffForm } from "./AdminForms";

type RosterTab = "players" | "staff";
type DrawerState = "player-add" | "player-edit" | "staff-add" | "staff-edit" | null;

export function RosterAdmin() {
  const store = useMockData();
  const { tier } = useTier();
  const [tab, setTab] = useState<RosterTab>("players");
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const players = store.players.filter((player) => player.teamId === prospect.defaultTeamId);
  const staff = store.staff.filter((member) => !member.teamId || member.teamId === prospect.defaultTeamId);
  const selectedPlayer = store.players.find((player) => player.id === selectedPlayerId);
  const selectedStaff = store.staff.find((member) => member.id === selectedStaffId);

  function closeDrawer() {
    setDrawer(null);
    setSelectedPlayerId(null);
    setSelectedStaffId(null);
  }

  function editPlayer(player: Player) {
    setSelectedPlayerId(player.id);
    setDrawer("player-edit");
  }

  function editStaff(member: StaffMember) {
    setSelectedStaffId(member.id);
    setDrawer("staff-edit");
  }

  const isPlayers = tab === "players";

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <span>Team operations</span>
          <h1>Roster</h1>
          <p>Manage players and technical staff in one place.</p>
        </div>
        <button onClick={() => setDrawer(isPlayers ? "player-add" : "staff-add")}>
          <span>+</span>
          {isPlayers ? "Add player" : "Add staff member"}
        </button>
      </header>

      <div className="admin-roster-tabs" role="tablist" aria-label="Roster groups">
        <button
          type="button"
          role="tab"
          aria-selected={isPlayers}
          aria-controls="admin-players-panel"
          id="admin-players-tab"
          onClick={() => setTab("players")}
        >
          Players <span>{players.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isPlayers}
          aria-controls="admin-staff-panel"
          id="admin-staff-tab"
          onClick={() => setTab("staff")}
        >
          Technical staff <span>{staff.length}</span>
        </button>
      </div>

      {isPlayers ? (
        <div id="admin-players-panel" role="tabpanel" aria-labelledby="admin-players-tab">
          <div className="limit-card">
            <div>
              <span>Profile capacity · {tier}</span>
              <strong>{TIER_LIMITS[tier].playerProfiles}</strong>
              <small>{TIER_LIMITS[tier].note}</small>
            </div>
            <b>{players.length}</b>
          </div>
          <section className="admin-panel entity-panel" aria-label="Players">
            {players.map((player) => (
              <div className="admin-entity" key={player.id}>
                <span className="entity-avatar logo">
                  <Image
                    src={player.photo ?? prospect.branding.crest}
                    alt=""
                    width={40}
                    height={40}
                    className={player.photo ? "person" : "crest"}
                  />
                </span>
                <div>
                  <strong>{player.firstName} {player.lastName}</strong>
                  <small>#{player.number} · {player.position}{player.hometown ? ` · ${player.hometown}` : ""}</small>
                </div>
                <div className="entity-actions">
                  <button onClick={() => editPlayer(player)}>Edit</button>
                  <button className="danger" onClick={() => store.dispatch({ type: "player/remove", id: player.id })}>Remove</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <div id="admin-staff-panel" role="tabpanel" aria-labelledby="admin-staff-tab">
          <section className="admin-panel entity-panel" aria-label="Technical staff">
            <div className="panel-heading">
              <div>
                <span>First team</span>
                <h2>Technical staff</h2>
              </div>
            </div>
            {staff.map((member) => (
              <div className="admin-entity" key={member.id}>
                <span className="entity-avatar logo">
                  <Image
                    src={member.photo ?? prospect.branding.crest}
                    alt=""
                    width={40}
                    height={40}
                    className={member.photo ? "person" : "crest"}
                  />
                </span>
                <div>
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                </div>
                <div className="entity-actions">
                  <button onClick={() => editStaff(member)}>Edit</button>
                  <button className="danger" onClick={() => store.dispatch({ type: "staff/remove", id: member.id })}>Remove</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {drawer === "player-add" && (
        <AdminDrawer eyebrow="Roster" title="Add player" onClose={closeDrawer}>
          <PlayerForm
            onCancel={closeDrawer}
            onSave={(player) => {
              store.dispatch({ type: "player/add", player: { ...player, id: nextId("p", store.players.map((item) => item.id)) } });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}

      {drawer === "player-edit" && selectedPlayer && (
        <AdminDrawer eyebrow="Roster" title={`Edit ${selectedPlayer.firstName} ${selectedPlayer.lastName}`} onClose={closeDrawer}>
          <PlayerForm
            initial={selectedPlayer}
            onCancel={closeDrawer}
            onSave={(player) => {
              store.dispatch({ type: "player/update", player: { ...player, id: selectedPlayer.id } });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}

      {drawer === "staff-add" && (
        <AdminDrawer eyebrow="Technical staff" title="Add staff member" onClose={closeDrawer}>
          <StaffForm
            onCancel={closeDrawer}
            onSave={(member) => {
              store.dispatch({ type: "staff/add", member: { ...member, id: nextId("st", store.staff.map((item) => item.id)) } });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}

      {drawer === "staff-edit" && selectedStaff && (
        <AdminDrawer eyebrow="Technical staff" title={`Edit ${selectedStaff.name}`} onClose={closeDrawer}>
          <StaffForm
            initial={selectedStaff}
            onCancel={closeDrawer}
            onSave={(member) => {
              store.dispatch({ type: "staff/update", member: { ...member, id: selectedStaff.id } });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}
    </div>
  );
}
