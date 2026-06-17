export type ProjectTier = "Free" | "Starter" | "Professional" | "Enterprise";
export type ProjectStatus = "on-track" | "attention" | "complete" | "not-started";

export interface Project {
  id: string;
  name: string;
  slug: string;
  tier: ProjectTier;
  date: string;
  location: string;
  description: string;
  groups: number;
  participants: number;
  judges: number;
  scoring: number; // 0..100
  status: ProjectStatus;
  initials: string;
  organizer: string;
}

export const projects: Project[] = [
  {
    id: "riga-2025",
    name: "Riga Spring Festival 2025",
    slug: "riga-spring-2025",
    tier: "Professional",
    date: "May 12, 2025",
    location: "Riga, Latvia",
    description:
      "Annual professional-tier competition featuring four categories across vocal and dance disciplines.",
    groups: 4,
    participants: 16,
    judges: 4,
    scoring: 71,
    status: "on-track",
    initials: "RS",
    organizer: "Anna Bērziņa",
  },
  {
    id: "tallinn-2025",
    name: "Tallinn Youth Choir Competition",
    slug: "tallinn-youth-2025",
    tier: "Starter",
    date: "June 4, 2025",
    location: "Tallinn, Estonia",
    description: "Youth choir showcase across two age divisions.",
    groups: 2,
    participants: 8,
    judges: 3,
    scoring: 40,
    status: "attention",
    initials: "TY",
    organizer: "Anna Bērziņa",
  },
  {
    id: "vilnius-2025",
    name: "Vilnius Dance Masters",
    slug: "vilnius-dance",
    tier: "Enterprise",
    date: "April 28, 2025",
    location: "Vilnius, Lithuania",
    description: "Enterprise-tier dance championship with five categories.",
    groups: 5,
    participants: 24,
    judges: 6,
    scoring: 100,
    status: "complete",
    initials: "VD",
    organizer: "Rūta Petrauskaitė",
  },
  {
    id: "helsinki-2025",
    name: "Helsinki Harmony Cup",
    slug: "helsinki-harmony",
    tier: "Free",
    date: "July 18, 2025",
    location: "Helsinki, Finland",
    description: "Free-tier debut event.",
    groups: 1,
    participants: 4,
    judges: 1,
    scoring: 0,
    status: "not-started",
    initials: "HH",
    organizer: "Mikael Korhonen",
  },
];

export interface Participant {
  id: string;
  number: number;
  name: string;
  song: string;
  studio: string;
  groupId: string;
  scored?: boolean;
}

export interface Group {
  id: string;
  name: string;
  ageRange?: string;
  participants: Participant[];
}

export const rigaGroups: Group[] = [
  {
    id: "g1",
    name: "Junior Soloists",
    ageRange: "Ages 8–12",
    participants: [
      { id: "p1", number: 1, name: "Emma Kalniņa", song: "Butterfly", studio: "Studio Melodija", groupId: "g1", scored: true },
      { id: "p2", number: 2, name: "Lucas Bērziņš", song: "Shine", studio: "Studio Nord", groupId: "g1", scored: true },
      { id: "p3", number: 3, name: "Mia Ozola", song: "Fly Away", studio: "Studio Melodija", groupId: "g1" },
      { id: "p4", number: 4, name: "Aria Liepa", song: "Starlight", studio: "Studio Harmonia", groupId: "g1" },
    ],
  },
  {
    id: "g2",
    name: "Senior Soloists",
    ageRange: "Ages 13–18",
    participants: [
      { id: "p5", number: 1, name: "Noah Jansons", song: "Echoes", studio: "Studio Melodija", groupId: "g2", scored: true },
      { id: "p6", number: 2, name: "Sofia Ķirše", song: "Velvet", studio: "Studio Nord", groupId: "g2", scored: true },
      { id: "p7", number: 3, name: "Ethan Dāvis", song: "Midnight Song", studio: "Studio Harmonia", groupId: "g2" },
      { id: "p8", number: 4, name: "Lily Rozentāle", song: "Ocean Eyes", studio: "Studio Melodija", groupId: "g2", scored: true },
    ],
  },
  {
    id: "g3",
    name: "Vocal Ensembles",
    participants: [
      { id: "p9", number: 1, name: "Harmonia Trio", song: "Silver Skies", studio: "Studio Harmonia", groupId: "g3" },
      { id: "p10", number: 2, name: "Resonance Quartet", song: "Tides", studio: "Studio Nord", groupId: "g3", scored: true },
      { id: "p11", number: 3, name: "Silver Voices", song: "Northern Lights", studio: "Studio Melodija", groupId: "g3" },
      { id: "p12", number: 4, name: "Nordic Souls", song: "Aurora", studio: "Studio Harmonia", groupId: "g3" },
    ],
  },
  {
    id: "g4",
    name: "Contemporary Dance",
    participants: [
      { id: "p13", number: 1, name: "Eclipse Dance Crew", song: "Gravity", studio: "Studio Nord", groupId: "g4", scored: true },
      { id: "p14", number: 2, name: "Pulse Collective", song: "Heartbeat", studio: "Studio Melodija", groupId: "g4" },
      { id: "p15", number: 3, name: "Wave Motion", song: "Undertow", studio: "Studio Harmonia", groupId: "g4" },
      { id: "p16", number: 4, name: "Neon Drift", song: "Citylines", studio: "Studio Nord", groupId: "g4" },
    ],
  },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Organizer" | "Judge";
  votesCast?: number;
  votesTotal?: number;
  status?: "complete" | "in-progress" | "not-started";
}

export const rigaTeam: TeamMember[] = [
  { id: "t1", name: "Anna Bērziņa", email: "anna.berzina@gmail.com", role: "Organizer" },
  { id: "t2", name: "Mārtiņš Kalniņš", email: "martins.kalnins@gmail.com", role: "Judge", votesCast: 16, votesTotal: 16, status: "complete" },
  { id: "t3", name: "Elena Sorokina", email: "elena.sorokina@gmail.com", role: "Judge", votesCast: 12, votesTotal: 16, status: "in-progress" },
  { id: "t4", name: "Jānis Ozols", email: "janis.ozols@gmail.com", role: "Judge", votesCast: 6, votesTotal: 16, status: "in-progress" },
  { id: "t5", name: "Katrina Velde", email: "katrina.velde@gmail.com", role: "Judge", votesCast: 0, votesTotal: 16, status: "not-started" },
];

export interface Criterion {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
}

export const rigaCriteria: Criterion[] = [
  { id: "c1", name: "Technique", description: "Vocal/movement accuracy, control, and precision.", min: 1, max: 10 },
  { id: "c2", name: "Expression", description: "Emotional delivery and interpretation.", min: 1, max: 10 },
  { id: "c3", name: "Stage Presence", description: "Composure, charisma, and audience connection.", min: 1, max: 10 },
];

export interface RankingRow {
  participantId: string;
  name: string;
  group: string;
  studio: string;
  technique: number;
  expression: number;
  presence: number;
  total: number;
}

export const rigaRanking: RankingRow[] = [
  { participantId: "p5", name: "Noah Jansons", group: "Senior Soloists", studio: "Studio Melodija", technique: 9.4, expression: 9.7, presence: 9.5, total: 28.6 },
  { participantId: "p2", name: "Lucas Bērziņš", group: "Junior Soloists", studio: "Studio Nord", technique: 9.2, expression: 9.3, presence: 9.6, total: 28.1 },
  { participantId: "p10", name: "Resonance Quartet", group: "Vocal Ensembles", studio: "Studio Nord", technique: 9.1, expression: 9.4, presence: 9.2, total: 27.7 },
  { participantId: "p6", name: "Sofia Ķirše", group: "Senior Soloists", studio: "Studio Nord", technique: 8.9, expression: 9.5, presence: 9.0, total: 27.4 },
  { participantId: "p13", name: "Eclipse Dance Crew", group: "Contemporary Dance", studio: "Studio Nord", technique: 9.0, expression: 8.8, presence: 9.3, total: 27.1 },
  { participantId: "p1", name: "Emma Kalniņa", group: "Junior Soloists", studio: "Studio Melodija", technique: 8.7, expression: 9.0, presence: 8.9, total: 26.6 },
  { participantId: "p8", name: "Lily Rozentāle", group: "Senior Soloists", studio: "Studio Melodija", technique: 8.5, expression: 8.8, presence: 8.6, total: 25.9 },
];

export interface VoteLogEntry {
  id: string;
  ts: string;
  judge: string;
  participant: string;
  group: string;
  technique: number;
  expression: number;
  presence: number;
  comment?: string;
}

export const rigaVoteLog: VoteLogEntry[] = [
  { id: "v1", ts: "Today, 14:22", judge: "Mārtiņš Kalniņš", participant: "Noah Jansons", group: "Senior Soloists", technique: 9, expression: 10, presence: 10, comment: "Effortless control across the register." },
  { id: "v2", ts: "Today, 14:18", judge: "Elena Sorokina", participant: "Noah Jansons", group: "Senior Soloists", technique: 10, expression: 9, presence: 9 },
  { id: "v3", ts: "Today, 14:11", judge: "Mārtiņš Kalniņš", participant: "Lucas Bērziņš", group: "Junior Soloists", technique: 9, expression: 9, presence: 10, comment: "Exceptional poise for his age." },
  { id: "v4", ts: "Today, 14:05", judge: "Jānis Ozols", participant: "Resonance Quartet", group: "Vocal Ensembles", technique: 9, expression: 9, presence: 9 },
  { id: "v5", ts: "Today, 13:58", judge: "Elena Sorokina", participant: "Sofia Ķirše", group: "Senior Soloists", technique: 9, expression: 10, presence: 9, comment: "Velvet was the right choice." },
  { id: "v6", ts: "Today, 13:51", judge: "Mārtiņš Kalniņš", participant: "Emma Kalniņa", group: "Junior Soloists", technique: 9, expression: 9, presence: 9 },
  { id: "v7", ts: "Today, 13:44", judge: "Elena Sorokina", participant: "Eclipse Dance Crew", group: "Contemporary Dance", technique: 9, expression: 9, presence: 10 },
  { id: "v8", ts: "Today, 13:30", judge: "Jānis Ozols", participant: "Lily Rozentāle", group: "Senior Soloists", technique: 8, expression: 9, presence: 9 },
];

export interface PlatformUser {
  id: string;
  email: string;
  name: string;
  role: "Superadmin" | "Organizer" | "Judge";
  projects: string[];
  lastActive: string;
}

export const platformUsers: PlatformUser[] = [
  { id: "u1", email: "superadmin@voicevibe.app", name: "Platform Admin", role: "Superadmin", projects: [], lastActive: "Active now" },
  { id: "u2", email: "anna.berzina@gmail.com", name: "Anna Bērziņa", role: "Organizer", projects: ["Riga Spring Festival 2025", "Tallinn Youth Choir"], lastActive: "12 min ago" },
  { id: "u3", email: "martins.kalnins@gmail.com", name: "Mārtiņš Kalniņš", role: "Judge", projects: ["Riga Spring Festival 2025"], lastActive: "1 hr ago" },
  { id: "u4", email: "elena.sorokina@gmail.com", name: "Elena Sorokina", role: "Judge", projects: ["Riga Spring Festival 2025", "Vilnius Dance Masters"], lastActive: "20 min ago" },
  { id: "u5", email: "janis.ozols@gmail.com", name: "Jānis Ozols", role: "Judge", projects: ["Riga Spring Festival 2025"], lastActive: "3 hr ago" },
  { id: "u6", email: "rūta.petrauskaite@gmail.com", name: "Rūta Petrauskaitė", role: "Organizer", projects: ["Vilnius Dance Masters"], lastActive: "Yesterday" },
];

export interface FeedbackItem {
  id: string;
  user: string;
  project: string;
  category: "Bug" | "Feature" | "Praise";
  body: string;
  ts: string;
  status: "new" | "reviewing" | "resolved";
}

export const feedbackItems: FeedbackItem[] = [
  { id: "f1", user: "Anna Bērziņa", project: "Riga Spring 2025", category: "Feature", body: "Would love to bulk-import participants from a CSV.", ts: "2 hours ago", status: "new" },
  { id: "f2", user: "Mārtiņš Kalniņš", project: "Riga Spring 2025", category: "Praise", body: "QR magic links worked perfectly on stage.", ts: "Yesterday", status: "resolved" },
  { id: "f3", user: "Rūta Petrauskaitė", project: "Vilnius Dance", category: "Bug", body: "Ranking export PDF missed the bronze row.", ts: "2 days ago", status: "reviewing" },
  { id: "f4", user: "Mikael Korhonen", project: "Helsinki Harmony", category: "Feature", body: "Can judges submit comments without numeric scores?", ts: "3 days ago", status: "new" },
];

export interface ParticipantScore {
  judge: string;
  technique: number;
  expression: number;
  presence: number;
  comment?: string;
}

export function getParticipantScores(participantId: string): ParticipantScore[] {
  return [
    { judge: "Mārtiņš Kalniņš", technique: 9, expression: 10, presence: 10, comment: "Effortless control across the register." },
    { judge: "Elena Sorokina", technique: 10, expression: 9, presence: 9, comment: "Mature interpretation, beautiful dynamics." },
    { judge: "Jānis Ozols", technique: 9, expression: 9, presence: 10 },
  ];
}

export function findParticipant(id: string): Participant | undefined {
  for (const g of rigaGroups) {
    const p = g.participants.find((x) => x.id === id);
    if (p) return p;
  }
  return undefined;
}

export function getGroup(id: string): Group | undefined {
  return rigaGroups.find((g) => g.id === id);
}
