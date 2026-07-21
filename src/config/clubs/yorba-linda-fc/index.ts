import type { Fixture, Player, Position, ProspectConfig, StaffMember } from "@/config/types";

// Hosted in the Mockup_DB Supabase project (org: Onzio Mockups), bucket
// "assets", folder "yorbaFCAssets" — see supabase-image-loader.js and
// next.config.ts for why these route through Supabase instead of Vercel's
// Image Optimization API.
const ASSET_BASE =
  "https://ydvggllbrswfchgjhjhr.supabase.co/storage/v1/object/public/assets/yorbaFCAssets";

const firstTeam: Array<[string, string, number, Position]> = [
  ["Aleks", "Petrov", 1, "GK"], ["Marc", "Dubois", 21, "GK"],
  ["Erion", "Kastrati", 2, "DF"], ["Rafael", "Souza", 3, "DF"], ["Jordan", "Mitchell", 4, "DF"], ["Nikolay", "Ivanov", 5, "DF"], ["Tyler", "Brooks", 15, "DF"], ["Bruno", "Alves", 22, "DF"],
  ["Dimitar", "Yankov", 6, "MF"], ["Enis", "Hoxha", 8, "MF"], ["Julien", "Marchand", 10, "MF"], ["Diego", "Ramirez", 14, "MF"], ["Thiago", "Costa", 18, "MF"], ["Kevin", "Nguyen", 23, "MF"],
  ["Gjergj", "Berisha", 7, "FW"], ["Matheus", "Lima", 9, "FW"], ["Antoine", "Girard", 11, "FW"], ["Marcus", "Reyes", 19, "FW"],
];

const makePlayers = (rows: Array<[string, string, number, Position]>, teamId: string, start: number): Player[] =>
  rows.map(([firstName, lastName, number, position], index) => ({
    id: `p${String(start + index).padStart(2, "0")}`, teamId, firstName, lastName, number, position,
    hometown: index % 4 === 0 ? "Yorba Linda, CA" : index % 4 === 1 ? "Anaheim, CA" : index % 4 === 2 ? "Fullerton, CA" : "Placentia, CA",
    height: position === "GK" ? "6'1\"" : index % 2 ? "5'10\"" : "6'0\"", yearJoined: 2026,
    bio: `${firstName} brings composure, work rate, and a team-first edge to Yorba Linda FC. A competitor built for the 18+ level.`,
    stats: { appearances: 6, starts: 3 + (index % 4), minutes: 360 + index * 21, goals: position === "FW" ? 2 + index % 3 : position === "MF" ? index % 3 : 0, assists: position === "MF" ? 1 + index % 3 : index % 2, yellowCards: index % 3, redCards: 0, ...(position === "GK" ? { cleanSheets: 1, saves: 18 + index * 2 } : {}) },
  }));

const played = (id: string, opponent: string, date: string, clubScore: number, opponentScore: number, homeAway: "home" | "away", venue: string, attendance?: number): Fixture => ({
  id, teamId: "first", seasonId: "s2026", opponent, date, venue, homeAway, competition: "SoCal Premier League", status: "played", result: { clubScore, opponentScore, attendance, scorers: clubScore ? ["G. Berisha 27'", "M. Lima 63'"].slice(0, clubScore) : [] },
});
const upcoming = (id: string, opponent: string, date: string, homeAway: "home" | "away", venue: string): Fixture => ({ id, teamId: "first", seasonId: "s2026", opponent, date, venue, homeAway, competition: "SoCal Premier League", status: "upcoming" });

const staff: StaffMember[] = [
  { id: "st01", teamId: "first", name: "Ivo Georgiev", role: "Head Coach", bio: "Leads training and matchday preparation for the first team." },
  { id: "st02", teamId: "first", name: "Carlos Fernandez", role: "Assistant Coach" },
  { id: "st03", teamId: "first", name: "Ledion Krasniqi", role: "Goalkeeper Coach" },
  { id: "st04", name: "Sarah Whitman", role: "Club Manager" },
];

export const yorbaLindaFc: ProspectConfig = {
  club: { name: "Yorba Linda FC", shortName: "Yorba Linda FC", initials: "YLFC", tagline: "Helping Orange County's competitive players reach semi-pro & pro levels.", foundedYear: 2026, league: "SoCal Premier League", division: "Men's Open SoCal – Spring", city: "Yorba Linda", state: "CA", venue: "Wagner Elementary School" },
  branding: {
    primaryColor: "#2A2E54",
    secondaryColor: "#DAAE2B",
    accentColor: "#FEFEFE",
    crest: `${ASSET_BASE}/crest.png`,
    heroImage: `${ASSET_BASE}/hero.webp`,
    heroImageAlt: "Yorba Linda FC's squad gathered on the pitch after a match",
    galleryImages: [
      { src: `${ASSET_BASE}/matchday-01.webp`, orientation: "portrait", alt: "Yorba Linda FC player poses with the match ball" },
      { src: `${ASSET_BASE}/matchday-02.webp`, orientation: "portrait", alt: "Yorba Linda FC players contest the ball near goal" },
      { src: `${ASSET_BASE}/matchday-03.webp`, orientation: "portrait", alt: "Yorba Linda FC midfielder brings the ball forward" },
      { src: `${ASSET_BASE}/matchday-04.webp`, orientation: "landscape", alt: "Yorba Linda FC squad photo before kickoff" },
    ],
  },
  copy: {
    metadata: {
      title: "Yorba Linda FC — Interactive Concept Preview",
      description: "A personalized Onzio club website and admin concept for Yorba Linda FC.",
    },
    home: {
      heroHeadline: ["Yorba Linda", "Built to compete."],
      heroIntro: "A multicultural 18+ men's soccer team out of Orange County, California, built for players who still take the game seriously.",
      collectionEyebrow: "Concept collection",
      collectionHeadline: ["Navy, gold,", "one crest."],
      collectionIntro: "A sample club collection built around the navy home and white away jerseys.",
      collectionItemLabel: "Concept merchandise",
      identityHeadline: ["A club shaped by", "Orange County."],
      gallerySectionHeadline: ["This is", "Orange County soccer."],
    },
    store: {
      eyebrow: "Concept club collection",
      headline: ["Made for matchday.", "Built for Orange County."],
      intro: "A future Yorba Linda FC store could carry the club identity beyond the pitch — starting with the home and away jerseys.",
      catalogEyebrow: "First-team concepts",
      catalogHeading: "Choose your colors.",
      catalogSummary: "2 sample products · concept preview",
      productTypeLabels: ["Home concept", "Away concept", "Training concept"],
      itemEyebrow: "Concept merchandise",
      collectionName: "Yorba Linda FC concepts",
      productDescription: "A sample Yorba Linda FC product finished in the club palette for this interactive concept preview.",
    },
    club: {
      headline: ["From Yorba Linda.", "For Orange County."],
    },
    fallbacks: {
      playerHometown: "Yorba Linda, CA",
      staffBio: "{name} supports the first-team environment and the standards that define Yorba Linda FC.",
    },
  },
  contact: { email: "hello@ocbulgar.com", phone: "213-200-5078", address: "Portola Springs Community Park Field B, CA 92618", social: { instagram: "https://www.instagram.com/yorbalindafc/", facebook: "https://www.facebook.com/yorbalindafc/" } },
  seasons: [{ id: "s2026", label: "2026 Season", status: "active" }],
  currentSeasonId: "s2026",
  teams: [{ id: "first", name: "First Team", shortLabel: "First Team" }],
  defaultTeamId: "first",
  roster: makePlayers(firstTeam, "first", 1),
  staff,
  fixtures: [
    played("f01", "Cypress United", "2026-05-10T19:00:00-07:00", 2, 1, "home", "Wagner Elementary School", 84),
    played("f02", "Placentia Rangers", "2026-05-17T18:00:00-07:00", 1, 1, "away", "Placentia Athletic Complex", 63),
    played("f03", "Brea Athletic", "2026-05-31T19:30:00-07:00", 3, 0, "home", "Wagner Elementary School", 97),
    played("f04", "Anaheim Hills FC", "2026-06-07T18:00:00-07:00", 1, 2, "away", "Anaheim Hills Community Park", 58),
    played("f05", "Chino Hills SC", "2026-06-21T19:00:00-07:00", 2, 2, "home", "Wagner Elementary School", 91),
    played("f06", "La Habra FC", "2026-06-28T19:00:00-07:00", 4, 1, "away", "La Habra Community Park", 70),
    played("f07", "Fullerton Rangers", "2026-07-12T19:00:00-07:00", 2, 1, "home", "Wagner Elementary School", 105),
    upcoming("f08", "Cypress United", "2026-08-16T19:00:00-07:00", "away", "Cypress Athletic Fields"),
    upcoming("f09", "Placentia Rangers", "2026-08-23T18:00:00-07:00", "home", "Wagner Elementary School"),
    upcoming("f10", "Brea Athletic", "2026-09-06T19:00:00-07:00", "away", "Brea Community Athletic Complex"),
    upcoming("f11", "Anaheim Hills FC", "2026-09-13T18:30:00-07:00", "home", "Wagner Elementary School"),
  ],
  about: {
    story: "Yorba Linda FC was created for players who still take the game seriously but don't always have clear options after high school, college, or academy programs. Some of our players have ambitions to play professionally, others are looking to stay sharp in a serious environment, and some simply miss competitive football.\n\nWe focus on the 18+ age group — players who are beyond youth academies but still want structured, challenging games. Our group brings together people from different countries and backgrounds, including players from Bulgaria, Albania, Brazil, France, and the U.S.\n\nAlthough the club is run as a hobby project, the expectations are clear: show up, compete, stay committed, and improve. We're not part of an official academy system, but some players have used their time here to stay ready for opportunities, both in the U.S. and abroad.",
    mission: "Bring out the best in our players and help them grow to semi-pro and pro levels.",
    highlights: ["Est. 2026 in Yorba Linda, California", "Multicultural 18+ roster spanning Bulgaria, Albania, Brazil, France, and the U.S.", "Competes in the SoCal Premier League"],
  },
  sponsors: [],
  store: { mode: "internal", products: [
    { id: "prod01", name: "Navy Home Jersey", price: 65, image: `${ASSET_BASE}/jersey-blue.webp`, category: "jersey", sizes: ["S", "M", "L", "XL"] },
    { id: "prod02", name: "White Away Jersey", price: 65, image: `${ASSET_BASE}/jersey-white.webp`, category: "jersey", sizes: ["S", "M", "L", "XL"] },
  ] },
  analytics: {
    weeklyPageViews: [{weekLabel:"Jun 1",views:210},{weekLabel:"Jun 8",views:265},{weekLabel:"Jun 15",views:298},{weekLabel:"Jun 22",views:312},{weekLabel:"Jun 29",views:355},{weekLabel:"Jul 6",views:401},{weekLabel:"Jul 13",views:438}],
    topPages: [{path:"/",label:"Home",views:1620},{path:"/roster",label:"Roster",views:940},{path:"/schedule",label:"Schedule",views:710},{path:"/stats",label:"Team stats",views:480},{path:"/store",label:"Team store",views:260}],
    deviceSplit: { mobile: 71, desktop: 24, tablet: 5 },
    rosterProfileViews: [{playerId:"p15",views:188},{playerId:"p16",views:171},{playerId:"p09",views:150},{playerId:"p11",views:132},{playerId:"p07",views:119}],
    sponsorImpressions: [],
    attendanceTrend: [{fixtureId:"f01",attendance:84},{fixtureId:"f02",attendance:63},{fixtureId:"f03",attendance:97},{fixtureId:"f04",attendance:58},{fixtureId:"f05",attendance:91},{fixtureId:"f06",attendance:70},{fixtureId:"f07",attendance:105}],
    storeInterest: [],
  },
};
