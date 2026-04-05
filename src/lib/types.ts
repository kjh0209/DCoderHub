export interface Hackathon {
  slug: string;
  title: string;
  status: "ongoing" | "ended" | "upcoming";
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

export interface SubmissionField {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "file";
  accept?: string;      // e.g. ".pdf", ".zip"
  placeholder?: string;
  required?: boolean;
  autoFill?: "userName"; // auto-populate from user profile
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview: {
      summary: string;
      teamPolicy: { allowSolo: boolean; maxTeamSize: number };
    };
    info: {
      notice: string[];
      links: { rules: string; faq: string };
    };
    eval: {
      metricName: string;
      description: string;
      scoreSource?: string;
      scoreDisplay?: {
        label: string;
        breakdown: { key: string; label: string; weightPercent: number }[];
      };
      limits?: { maxRuntimeSec: number; maxSubmissionsPerDay: number };
      evalCriteria?: { category: string; points: number; description: string }[];
    };
    schedule: {
      timezone: string;
      milestones: { name: string; at: string; tag?: string }[];
    };
    prize: {
      totalKRW?: number;
      items: { place: string; amountKRW: number }[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: {
        key: string;
        title: string;
        format: string;
        note?: string;
        openAt?: string;      // ISO string — when submissions open
        deadlineAt?: string;  // ISO string — submission deadline for this item
        fields?: SubmissionField[];
      }[];
      checklistItems?: string[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

export interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: { type: string; url: string };
  createdAt: string;
  captainId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;           // for duplicate prevention
  provider?: "email" | "google";
  createdAt: string;
  // Profile
  nickname?: string;
  bio?: string;
  roles?: string[];
  skills?: string[];
  github?: string;
  youtube?: string;
  googleDrive?: string;
  linkedin?: string;
  emailPublic?: boolean;
}

export interface DailyUsage {
  userId: string;
  date: string; // YYYY-MM-DD
  chatCount: number;
  matchCount: number;
}

export interface TeamApplication {
  id: string;
  teamCode: string;
  hackathonSlug: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  roles: string[];
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: { participant: number; judge: number };
  artifacts?: { webUrl: string; pdfUrl: string; planTitle: string };
}

export interface LeaderboardData {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

export interface Submission {
  id: string;
  hackathonSlug: string;
  itemKey: string; // format: "submissionItemKey.fieldKey" for multi-field
  value: string;
  fileName?: string;
  submittedAt: string;
  notes?: string;
}

export interface HackathonParticipation {
  userId: string;
  hackathonSlug: string;
  registeredAt: string;
}

export interface UserProfile {
  roles: string[];
  skills: string[];
  intro: string;
}

export interface TeamMatchResult {
  teamCode: string;
  teamName: string;
  matchRate: number;
  reason: string;
}

export interface RankingEntry {
  rank: number;
  nickname: string;
  points: number;
  hackathonCount: number;
  firstPlaceCount: number;
  lastActiveAt: string;
}
