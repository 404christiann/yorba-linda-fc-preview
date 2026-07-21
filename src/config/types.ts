export interface ProspectConfig {
  club: ClubIdentity;
  branding: Branding;
  copy: ProspectCopy;
  contact: ContactInfo;
  seasons: Season[];
  currentSeasonId: string;
  teams: Team[];
  defaultTeamId: string;
  roster: Player[];
  staff: StaffMember[];
  fixtures: Fixture[];
  about: AboutContent;
  sponsors: Sponsor[];
  store: StoreConfig;
  analytics: AnalyticsSample;
}

export interface ProspectCopy {
  metadata: {
    title: string;
    description: string;
  };
  home: {
    heroHeadline: [string, string];
    heroIntro: string;
    collectionEyebrow: string;
    collectionHeadline: [string, string];
    collectionIntro: string;
    collectionItemLabel: string;
    identityHeadline: [string, string];
    gallerySectionHeadline: [string, string];
  };
  store: {
    eyebrow: string;
    headline: [string, string];
    intro: string;
    catalogEyebrow: string;
    catalogHeading: string;
    catalogSummary: string;
    productTypeLabels: string[];
    itemEyebrow: string;
    collectionName: string;
    productDescription: string;
  };
  club: {
    headline: [string, string];
  };
  fallbacks: {
    playerHometown: string;
    staffBio: string;
  };
}

export interface ClubIdentity {
  name: string;
  shortName: string;
  initials: string;
  tagline?: string;
  foundedYear?: number;
  league: string;
  division?: string;
  city: string;
  state: string;
  venue?: string;
}

export interface Branding {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  crest: string;
  /** Optional mono/light crest variant for dark or primary-color surfaces. Falls back to `crest`. */
  crestOnDark?: string;
  heroImage: string;
  heroImageAlt: string;
  galleryImages?: Array<string | GalleryImage>;
}

export interface GalleryImage {
  src: string;
  orientation?: "portrait" | "landscape";
  objectPosition?: string;
  alt?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
  social?: Partial<Record<"instagram" | "facebook" | "twitter" | "youtube" | "tiktok", string>>;
}

export interface Season { id: string; label: string; status: "active" | "completed" | "upcoming"; }
export interface Team { id: string; name: string; shortLabel: string; }
export type Position = "GK" | "DF" | "MF" | "FW";

export interface Player {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  number: number;
  position: Position;
  photo?: string;
  hometown?: string;
  height?: string;
  yearJoined?: number;
  bio?: string;
  stats?: PlayerSeasonStats;
}

export interface PlayerSeasonStats {
  appearances: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets?: number;
  saves?: number;
}

export interface StaffMember { id: string; teamId?: string; name: string; role: string; photo?: string; bio?: string; }

export interface Fixture {
  id: string;
  teamId: string;
  seasonId: string;
  opponent: string;
  date: string;
  venue: string;
  homeAway: "home" | "away";
  competition?: string;
  status: "upcoming" | "played";
  result?: MatchResult;
}

export interface MatchResult { clubScore: number; opponentScore: number; scorers?: string[]; attendance?: number; note?: string; }
export interface AboutContent { story: string; mission?: string; highlights?: string[]; }
export interface Sponsor { id: string; name: string; logo: string; level: "title" | "gold" | "partner"; url?: string; blurb?: string; }
export interface StoreConfig { mode: "internal" | "external"; externalProviderLabel?: string; products: Product[]; }
export interface Product { id: string; name: string; price: number; image: string; category: "jersey" | "training" | "accessory" | "youth"; sizes?: string[]; }

export interface AnalyticsSample {
  weeklyPageViews: { weekLabel: string; views: number }[];
  topPages: { path: string; label: string; views: number }[];
  deviceSplit: { mobile: number; desktop: number; tablet: number };
  rosterProfileViews: { playerId: string; views: number }[];
  sponsorImpressions?: { sponsorId: string; impressions: number }[];
  attendanceTrend?: { fixtureId: string; attendance: number }[];
  storeInterest?: { productId: string; views: number }[];
}
