"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { Fixture, MatchResult, Player, Product, ProspectConfig, Season, Sponsor, StaffMember, Team } from "@/config/types";

export interface MockDataState {
  players: Player[]; staff: StaffMember[]; fixtures: Fixture[]; sponsors: Sponsor[]; products: Product[]; seasons: Season[]; teams: Team[];
}

type Action =
  | { type: "player/add"; player: Player } | { type: "player/update"; player: Player } | { type: "player/remove"; id: string }
  | { type: "staff/add"; member: StaffMember } | { type: "staff/update"; member: StaffMember } | { type: "staff/remove"; id: string }
  | { type: "fixture/add"; fixture: Fixture } | { type: "fixture/update"; fixture: Fixture } | { type: "fixture/recordResult"; id: string; result: MatchResult }
  | { type: "sponsor/add"; sponsor: Sponsor } | { type: "sponsor/update"; sponsor: Sponsor } | { type: "sponsor/remove"; id: string }
  | { type: "product/add"; product: Product } | { type: "product/update"; product: Product } | { type: "product/remove"; id: string }
  | { type: "season/add"; season: Season } | { type: "reset"; state: MockDataState };

interface StoreValue extends MockDataState {
  dispatch: React.Dispatch<Action>;
  initial: MockDataState;
}

const StoreContext = createContext<StoreValue | null>(null);

function reducer(state: MockDataState, action: Action): MockDataState {
  switch (action.type) {
    case "player/add": return { ...state, players: [...state.players, action.player] };
    case "player/update": return { ...state, players: state.players.map((item) => item.id === action.player.id ? action.player : item) };
    case "player/remove": return { ...state, players: state.players.filter((item) => item.id !== action.id) };
    case "staff/add": return { ...state, staff: [...state.staff, action.member] };
    case "staff/update": return { ...state, staff: state.staff.map((item) => item.id === action.member.id ? action.member : item) };
    case "staff/remove": return { ...state, staff: state.staff.filter((item) => item.id !== action.id) };
    case "fixture/add": return { ...state, fixtures: [...state.fixtures, action.fixture] };
    case "fixture/update": return { ...state, fixtures: state.fixtures.map((item) => item.id === action.fixture.id ? action.fixture : item) };
    case "fixture/recordResult": return { ...state, fixtures: state.fixtures.map((item) => item.id === action.id ? { ...item, status: "played", result: action.result } : item) };
    case "sponsor/add": return { ...state, sponsors: [...state.sponsors, action.sponsor] };
    case "sponsor/update": return { ...state, sponsors: state.sponsors.map((item) => item.id === action.sponsor.id ? action.sponsor : item) };
    case "sponsor/remove": return { ...state, sponsors: state.sponsors.filter((item) => item.id !== action.id) };
    case "product/add": return { ...state, products: [...state.products, action.product] };
    case "product/update": return { ...state, products: state.products.map((item) => item.id === action.product.id ? action.product : item) };
    case "product/remove": return { ...state, products: state.products.filter((item) => item.id !== action.id) };
    case "season/add": return { ...state, seasons: [...state.seasons, action.season] };
    case "reset": return action.state;
  }
}

function seed(config: ProspectConfig): MockDataState {
  return { players: config.roster, staff: config.staff, fixtures: config.fixtures, sponsors: config.sponsors, products: config.store.products, seasons: config.seasons, teams: config.teams };
}

export function MockDataProvider({ config, children }: { config: ProspectConfig; children: ReactNode }) {
  const initial = useMemo(() => seed(config), [config]);
  const [state, dispatch] = useReducer(reducer, initial);
  return <StoreContext.Provider value={{ ...state, dispatch, initial }}>{children}</StoreContext.Provider>;
}

export function useMockData() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useMockData must be used inside MockDataProvider");
  return value;
}

export function nextId(prefix: string, ids: string[]) {
  const highest = Math.max(0, ...ids.map((id) => Number(id.replace(/\D/g, "")) || 0));
  return `${prefix}${String(highest + 1).padStart(2, "0")}`;
}
