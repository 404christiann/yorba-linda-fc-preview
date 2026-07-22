"use client";

import { useState } from "react";
import Image from "next/image";
import { prospect } from "@/config/prospect";
import type { StandingsRow } from "@/config/types";
import { nextId, useMockData } from "@/lib/store/MockDataProvider";
import { AdminDrawer } from "./AdminDrawer";
import { StandingsRowForm } from "./AdminForms";

type DrawerState = "add" | "edit" | null;

export function StandingsAdmin() {
  const store = useMockData();
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = [...store.standings].sort((a, b) => b.points - a.points || b.gd - a.gd);
  const selected = store.standings.find((row) => row.id === selectedId);

  function closeDrawer() {
    setDrawer(null);
    setSelectedId(null);
  }

  function editRow(row: StandingsRow) {
    setSelectedId(row.id);
    setDrawer("edit");
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <span>Competition</span>
          <h1>Standings</h1>
          <p>{prospect.standings?.competitionName ?? "League table"} — teams are sorted by points automatically.</p>
        </div>
        <button onClick={() => setDrawer("add")}>
          <span>+</span>
          Add team
        </button>
      </header>

      <section className="admin-panel entity-panel" aria-label="League standings">
        {rows.length === 0 && (
          <p className="standings-admin-empty">No teams yet. Add the first team to start the table.</p>
        )}
        {rows.map((row, index) => (
          <div className="admin-entity standings-admin-row" key={row.id}>
            <span className="entity-avatar logo standings-admin-rank">{index + 1}</span>
            <span className="entity-avatar logo">
              <Image
                src={row.teamLogo ?? prospect.branding.crest}
                alt=""
                width={40}
                height={40}
                className={row.teamLogo ? "person" : "crest"}
              />
            </span>
            <div>
              <strong>{row.teamName}</strong>
              <small>
                GP {row.gp} · W {row.w} · D {row.d} · L {row.l} · GD {row.gd > 0 ? `+${row.gd}` : row.gd} · {row.points} pts
              </small>
            </div>
            <div className="entity-actions">
              <button onClick={() => editRow(row)}>Edit</button>
              <button className="danger" onClick={() => store.dispatch({ type: "standingsRow/remove", id: row.id })}>Remove</button>
            </div>
          </div>
        ))}
      </section>

      {drawer === "add" && (
        <AdminDrawer eyebrow="Standings" title="Add team" onClose={closeDrawer}>
          <StandingsRowForm
            onCancel={closeDrawer}
            onSave={(row) => {
              store.dispatch({ type: "standingsRow/add", row: { ...row, id: nextId("std", store.standings.map((item) => item.id)) } });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}

      {drawer === "edit" && selected && (
        <AdminDrawer eyebrow="Standings" title={`Edit ${selected.teamName}`} onClose={closeDrawer}>
          <StandingsRowForm
            initial={selected}
            onCancel={closeDrawer}
            onSave={(row) => {
              store.dispatch({ type: "standingsRow/update", row: { ...row, id: selected.id } });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}
    </div>
  );
}
