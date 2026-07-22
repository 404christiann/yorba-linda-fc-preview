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
  /** Optional league table for the club page. Omit entirely for clubs that don't want it. */
  standings?: StandingsTable;
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
    gallerySectionHeadline: [string, string];
    recruitHeadline: [string, string];
    recruitIntro: string;
    recruitButtonLabel: string;
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
  /** Governing-body / league affiliation marks shown in the nav next to the crest (e.g. US Soccer, FIFA). Optional — most prospects won't have these. */
  affiliations?: { name: string; colorLogo: string; whiteLogo: string }[];
  /** Optional closing full-bleed recruiting photo for the homepage's final section. */
  recruitImage?: string;
  recruitImageAlt?: string;
  /** Optional player cutout shown fading into the background behind the store's featured product. Falls back to the featured product's own photo. */
  storeHeroImage?: string;
  storeHeroImageAlt?: string;
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
  trainingHours?: { label: string; hours: string }[];
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
  nationality?: string;
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

export interface StaffMember { id: string; teamId?: string; name: string; role: string; photo?: string; nationality?: string; bio?: string; }

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
export interface AboutContent {
  story: string;
  mission?: string;
  highlights?: string[];
  training?: { intro: string; points: string[]; closing?: string };
}
export interface Sponsor { id: string; name: string; logo: string; level: "title" | "gold" | "partner"; url?: string; blurb?: string; }
export interface StoreConfig { mode: "internal" | "external"; externalProviderLabel?: string; products: Product[]; }
export interface Product { id: string; name: string; price: number; image: string; /** Optional back-of-garment photo, shown via a toggle in the product detail modal. */ backImage?: string; category: "jersey" | "training" | "accessory" | "youth"; sizes?: string[]; }

export interface StandingsRow { id: string; teamName: string; teamLogo?: string; gp: number; w: number; d: number; l: number; gd: number; points: number; }
export interface StandingsTable { competitionName: string; intro?: string; rows: StandingsRow[]; }

export interface AnalyticsSample {
  weeklyPageViews: { weekLabel: string; views: number }[];
  topPages: { path: string; label: string; views: number }[];
  deviceSplit: { mobile: number; desktop: number; tablet: number };
  rosterProfileViews: { playerId: string; views: number }[];
  sponsorImpressions?: { sponsorId: string; impressions: number }[];
  attendanceTrend?: { fixtureId: string; attendance: number }[];
  storeInterest?: { productId: string; views: number }[];
}
