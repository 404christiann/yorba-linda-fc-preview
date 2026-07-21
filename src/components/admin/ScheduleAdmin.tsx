"use client";

import { useState } from "react";
import type { Fixture } from "@/config/types";
import { prospect } from "@/config/prospect";
import { nextId, useMockData } from "@/lib/store/MockDataProvider";
import { AdminDrawer } from "./AdminDrawer";
import { FixtureForm, ResultForm } from "./AdminForms";

type DrawerState = "fixture-add" | "fixture-edit" | "result" | null;

export function ScheduleAdmin() {
  const store = useMockData();
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>(null);

  const upcoming = store.fixtures
    .filter(
      (fixture) =>
        fixture.teamId === prospect.defaultTeamId &&
        fixture.status === "upcoming",
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const played = store.fixtures
    .filter(
      (fixture) =>
        fixture.teamId === prospect.defaultTeamId && fixture.status === "played",
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const selectedFixture = store.fixtures.find(
    (fixture) => fixture.id === selectedFixtureId,
  );

  function closeDrawer() {
    setDrawer(null);
    setSelectedFixtureId(null);
  }

  function openFixtureEditor(fixture: Fixture) {
    setSelectedFixtureId(fixture.id);
    setDrawer("fixture-edit");
  }

  function openResultEditor(fixture: Fixture) {
    setSelectedFixtureId(fixture.id);
    setDrawer("result");
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <span>Match operations</span>
          <h1>Schedule</h1>
          <p>Add fixtures, update match details, and publish final scores.</p>
        </div>
        <button onClick={() => setDrawer("fixture-add")}>
          <span>+</span>
          Add fixture
        </button>
      </header>

      <section className="admin-panel entity-panel">
        <div className="panel-heading">
          <div>
            <span>Coming up</span>
            <h2>Upcoming</h2>
          </div>
        </div>
        {upcoming.map((fixture) => (
          <div className="admin-entity" key={fixture.id}>
            <span className="entity-avatar date">
              {new Date(fixture.date).getDate()}
              <small>
                {new Date(fixture.date).toLocaleString("en-US", {
                  month: "short",
                })}
              </small>
            </span>
            <div>
              <strong>{fixture.opponent}</strong>
              <small>
                {fixture.homeAway} · {fixture.venue}
              </small>
            </div>
            <div className="entity-actions">
              <button
                aria-label={`Edit schedule for ${fixture.opponent}`}
                onClick={() => openFixtureEditor(fixture)}
              >
                Edit
              </button>
              <button
                className="record"
                onClick={() => openResultEditor(fixture)}
              >
                Record result
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="admin-panel entity-panel">
        <div className="panel-heading">
          <div>
            <span>Completed</span>
            <h2>Results</h2>
          </div>
        </div>
        {played.slice(0, 7).map((fixture) => (
          <div className="admin-entity" key={fixture.id}>
            <span className="entity-avatar score">
              {fixture.result?.clubScore}–{fixture.result?.opponentScore}
            </span>
            <div>
              <strong>{fixture.opponent}</strong>
              <small>
                {new Date(fixture.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </small>
            </div>
            <div className="entity-actions">
              <button
                aria-label={`Edit schedule for ${fixture.opponent}`}
                onClick={() => openFixtureEditor(fixture)}
              >
                Edit match
              </button>
              <button
                className="record"
                aria-label={`Edit result for ${fixture.opponent}`}
                onClick={() => openResultEditor(fixture)}
              >
                Edit result
              </button>
            </div>
          </div>
        ))}
      </section>

      {drawer === "fixture-add" && (
        <AdminDrawer eyebrow="Schedule" title="Add fixture" onClose={closeDrawer}>
          <FixtureForm
            onCancel={closeDrawer}
            onSave={(fixture) => {
              store.dispatch({
                type: "fixture/add",
                fixture: {
                  ...fixture,
                  id: nextId(
                    "f",
                    store.fixtures.map((item) => item.id),
                  ),
                },
              });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}

      {drawer === "fixture-edit" && selectedFixture && (
        <AdminDrawer
          eyebrow="Schedule"
          title={`Edit ${selectedFixture.opponent}`}
          onClose={closeDrawer}
        >
          <FixtureForm
            initial={selectedFixture}
            onCancel={closeDrawer}
            onSave={(fixture) => {
              store.dispatch({
                type: "fixture/update",
                fixture: { ...fixture, id: selectedFixture.id },
              });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}

      {drawer === "result" && selectedFixture && (
        <AdminDrawer
          eyebrow="Match result"
          title={selectedFixture.result ? "Edit final score" : "Record final score"}
          onClose={closeDrawer}
        >
          <ResultForm
            fixture={selectedFixture}
            onCancel={closeDrawer}
            onSave={(result) => {
              store.dispatch({
                type: "fixture/recordResult",
                id: selectedFixture.id,
                result,
              });
              closeDrawer();
            }}
          />
        </AdminDrawer>
      )}
    </div>
  );
}
