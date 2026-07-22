import type { Fixture, Player, Position, ProspectConfig, StaffMember } from "@/config/types";

// Hosted in the Mockup_DB Supabase project (org: Onzio Mockups), bucket
// "assets", folder "yorbaFCAssets" — see supabase-image-loader.js and
// next.config.ts for why these route through Supabase instead of Vercel's
// Image Optimization API.
const ASSET_BASE =
  "https://ydvggllbrswfchgjhjhr.supabase.co/storage/v1/object/public/assets/yorbaFCAssets";

// Real transparent-cutout player photo, also used as the store's featured
// product image — reused here for the first-team roster's starting
// goalkeeper so one real photo appears in both places.
const PLAYER_PHOTO = `${ASSET_BASE}/${encodeURIComponent("Yorba Linda FC roster pic example website cutout.png")}`;

// Same Supabase project, separate bucket ("sponor_logos" — bucket name as
// created, not a typo introduced here), folder "yorbaLindaFC". These are the
// club's real sponsors — white-on-transparent logo files, meant to sit on a
// dark section background.
const SPONSOR_ASSET_BASE =
  "https://ydvggllbrswfchgjhjhr.supabase.co/storage/v1/object/public/sponor_logos/yorbaLindaFC";
const sponsorLogo = (fileName: string) => `${SPONSOR_ASSET_BASE}/${encodeURIComponent(fileName)}`;

// Same Supabase project, separate bucket ("leagueLogos"). Governing-body /
// league marks shown in the nav next to the crest — color variant for the
// solid/scrolled nav, white variant for the transparent nav over a hero.
const LEAGUE_LOGO_BASE =
  "https://ydvggllbrswfchgjhjhr.supabase.co/storage/v1/object/public/leagueLogos";
const leagueLogo = (fileName: string) => `${LEAGUE_LOGO_BASE}/${encodeURIComponent(fileName)}`;

const firstTeam: Array<[string, string, number, Position, string]> = [
  ["Aleks", "Petrov", 1, "GK", "Bulgarian"], ["Marc", "Dubois", 21, "GK", "French"],
  ["Erion", "Kastrati", 2, "DF", "Albanian"], ["Rafael", "Souza", 3, "DF", "Brazilian"], ["Jordan", "Mitchell", 4, "DF", "American"], ["Nikolay", "Ivanov", 5, "DF", "Bulgarian"], ["Tyler", "Brooks", 15, "DF", "American"], ["Bruno", "Alves", 22, "DF", "Brazilian"],
  ["Dimitar", "Yankov", 6, "MF", "Bulgarian"], ["Enis", "Hoxha", 8, "MF", "Albanian"], ["Julien", "Marchand", 10, "MF", "French"], ["Diego", "Ramirez", 14, "MF", "Mexican"], ["Thiago", "Costa", 18, "MF", "Brazilian"], ["Kevin", "Nguyen", 23, "MF", "American"],
  ["Gjergj", "Berisha", 7, "FW", "Albanian"], ["Matheus", "Lima", 9, "FW", "Brazilian"], ["Antoine", "Girard", 11, "FW", "French"], ["Marcus", "Reyes", 19, "FW", "Mexican"],
];

const makePlayers = (rows: Array<[string, string, number, Position, string]>, teamId: string, start: number): Player[] =>
  rows.map(([firstName, lastName, number, position, nationality], index) => ({
    id: `p${String(start + index).padStart(2, "0")}`, teamId, firstName, lastName, number, position, nationality,
    ...(teamId === "first" && index === 0 ? { photo: PLAYER_PHOTO } : {}),
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
  { id: "st01", teamId: "first", name: "Ivo Georgiev", role: "Head Coach", nationality: "Bulgarian", bio: "Leads training and matchday preparation for the first team." },
  { id: "st02", teamId: "first", name: "Carlos Fernandez", role: "Assistant Coach", nationality: "Mexican" },
  { id: "st03", teamId: "first", name: "Ledion Krasniqi", role: "Goalkeeper Coach", nationality: "Albanian" },
  { id: "st04", name: "Sarah Whitman", role: "Club Manager", nationality: "American" },
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
    affiliations: [
      { name: "US Soccer", colorLogo: leagueLogo("US Soccer logo color.png"), whiteLogo: leagueLogo("US Soccer logo white.png") },
      { name: "FIFA", colorLogo: leagueLogo("FIFA logo color.png"), whiteLogo: leagueLogo("FIFA logo white.png") },
      { name: "UPSL", colorLogo: leagueLogo("UPSL logo color.png"), whiteLogo: leagueLogo("UPSL logo white.png") },
      { name: "SWPL", colorLogo: leagueLogo("SWPL_logo_Color.webp"), whiteLogo: leagueLogo("SWPL.png") },
    ],
    recruitImage: `${ASSET_BASE}/ready_to_compete.jpg`,
    recruitImageAlt: "Yorba Linda FC player dribbling past a defender during a match",
    storeHeroImage: PLAYER_PHOTO,
    storeHeroImageAlt: "Yorba Linda FC player wearing the club jersey",
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
      gallerySectionHeadline: ["This is", "Orange County soccer."],
      recruitHeadline: ["Ready to", "compete?"],
      recruitIntro: "We're scouting driven, disciplined players ready to prove themselves at a serious amateur or semi-pro level.",
      recruitButtonLabel: "Join today",
    },
    store: {
      eyebrow: "Concept club collection",
      headline: ["Made for matchday.", "Built for Orange County."],
      intro: "A future Yorba Linda FC store could carry the club identity beyond the pitch — starting with the home and away jerseys.",
      catalogEyebrow: "First-team concepts",
      catalogHeading: "Choose your colors.",
      catalogSummary: "2 sample products · concept preview",
      productTypeLabels: ["Away concept", "Home concept", "Training concept"],
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
  contact: {
    email: "hello@ocbulgar.com", phone: "213-200-5078", address: "Portola Springs Community Park Field B, CA 92618",
    trainingHours: [{ label: "Mon–Fri", hours: "9am–8pm" }, { label: "Saturday", hours: "10am–4pm" }],
    social: { instagram: "https://www.instagram.com/yorbalindafc/", facebook: "https://www.facebook.com/yorbalindafc/" },
  },
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
    groupPhoto: { image: `${ASSET_BASE}/group_photo.jpg`, alt: "Yorba Linda FC players huddled together on the field before a match" },
    training: {
      intro: "Training is focused on match preparation, fitness, and technical sharpness. Sessions cover:",
      points: [
        "Small-sided games and position-specific drills",
        "Tactical preparation based on upcoming opponents",
        "Fitness work to maintain match readiness",
        "Scrimmages and situational play",
      ],
      closing: "We train with the same standards you'd expect from serious amateur or semi-pro setups — without overcomplicating it.",
    },
  },
  standings: {
    competitionName: "SoCal Premier League",
    intro: "Yorba Linda FC competes in a regional men's league with competitive amateur and semi-pro teams from across Southern California. Matches are competitive and physical, offering serious players a way to stay sharp and test themselves regularly.",
    rows: [
      { id: "std01", teamName: "Fullerton Rangers", gp: 7, w: 5, d: 1, l: 1, gd: 12, points: 16 },
      { id: "std02", teamName: "Yorba Linda FC", teamLogo: `${ASSET_BASE}/crest.png`, gp: 7, w: 4, d: 2, l: 1, gd: 7, points: 14 },
      { id: "std03", teamName: "Cypress United", gp: 7, w: 4, d: 0, l: 3, gd: 3, points: 12 },
      { id: "std04", teamName: "Chino Hills SC", gp: 7, w: 3, d: 2, l: 2, gd: 1, points: 11 },
      { id: "std05", teamName: "Brea Athletic", gp: 7, w: 3, d: 1, l: 3, gd: -2, points: 10 },
      { id: "std06", teamName: "La Habra FC", gp: 7, w: 2, d: 2, l: 3, gd: -4, points: 8 },
      { id: "std07", teamName: "Placentia Rangers", gp: 7, w: 1, d: 3, l: 3, gd: -6, points: 6 },
      { id: "std08", teamName: "Anaheim Hills FC", gp: 7, w: 1, d: 1, l: 5, gd: -11, points: 4 },
    ],
  },
  sponsors: [
    { id: "sp01", name: "Azure", level: "partner", logo: sponsorLogo("Azure logo white.png") },
    { id: "sp02", name: "Fidelity", level: "partner", logo: sponsorLogo("Fidelity logo white.png") },
    { id: "sp03", name: "Flowable", level: "partner", logo: sponsorLogo("Flowable logo white.png") },
    { id: "sp04", name: "IBM", level: "partner", logo: sponsorLogo("IBM logo white.png") },
    { id: "sp05", name: "Mark43", level: "partner", logo: sponsorLogo("Mark43logo white.png") },
    { id: "sp06", name: "Pega", level: "partner", logo: sponsorLogo("Pega logo white.png") },
    { id: "sp07", name: "Shift Sports", level: "partner", logo: sponsorLogo("Shift Sports logo white.png") },
  ],
  store: { mode: "internal", products: [
    {
      id: "prod02", name: "White Away Jersey", price: 65,
      image: `${ASSET_BASE}/${encodeURIComponent("Yorbra Linda Football Club Away Jersey.png")}`,
      backImage: `${ASSET_BASE}/yorba_updated_jersey_white.png`,
      category: "jersey", sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "prod01", name: "Navy Home Jersey", price: 65,
      image: `${ASSET_BASE}/${encodeURIComponent("Yorbra Linda Football Club Home Jersey.png")}`,
      backImage: `${ASSET_BASE}/yorba_updated_jersey_navy.png`,
      category: "jersey", sizes: ["S", "M", "L", "XL"],
    },
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
