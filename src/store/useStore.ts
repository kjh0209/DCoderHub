import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Hackathon,
  HackathonDetail,
  Team,
  LeaderboardData,
  Submission,
  RankingEntry,
  User,
  TeamApplication,
  HackathonParticipation,
  DailyUsage,
} from "@/lib/types";
import {
  SEED_HACKATHONS,
  SEED_HACKATHON_DETAILS,
  SEED_TEAMS,
  SEED_LEADERBOARDS,
  SEED_RANKINGS,
  DATA_VERSION,
} from "@/lib/seed-data";
import { generateId } from "@/lib/utils";

interface StoreState {
  hackathons: Hackathon[];
  hackathonDetails: Record<string, HackathonDetail>;
  teams: Team[];
  leaderboards: Record<string, LeaderboardData>;
  submissions: Submission[];
  rankings: RankingEntry[];
  theme: "light" | "dark";
  initialized: boolean;
  dataVersion: number;

  // Auth
  currentUser: User | null;
  users: User[];

  // Team applications
  applications: TeamApplication[];

  // Hackathon participations
  participations: HackathonParticipation[];

  // Usage log
  usageLog: DailyUsage[];

  // Actions
  initializeData: () => void;
  toggleTheme: () => void;
  addTeam: (team: Omit<Team, "teamCode" | "createdAt">) => void;
  updateTeam: (teamCode: string, updates: Partial<Team>) => void;
  addSubmission: (submission: Omit<Submission, "id" | "submittedAt">) => void;
  getTeamsByHackathon: (slug: string) => Team[];
  getLeaderboard: (slug: string) => LeaderboardData | undefined;
  getHackathonDetail: (slug: string) => HackathonDetail | undefined;
  getSubmissions: (hackathonSlug: string) => Submission[];

  // Auth actions
  register: (name: string, email: string, password: string, phone?: string) => User | { error: string };
  loginWithGoogle: (name: string, email: string, phone?: string) => User;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  updateUserProfile: (updates: Partial<Pick<User, "nickname" | "bio" | "roles" | "skills" | "github" | "youtube" | "googleDrive" | "linkedin" | "emailPublic">>) => void;

  // Participation actions
  joinHackathon: (hackathonSlug: string) => void;

  // Usage actions
  incrementChatUsage: (userId: string) => boolean;
  incrementMatchUsage: (userId: string) => boolean;
  getDailyUsage: (userId: string) => DailyUsage;

  // Application actions
  addApplication: (app: Omit<TeamApplication, "id" | "createdAt">) => void;
  updateApplicationStatus: (id: string, status: "accepted" | "rejected") => void;
  getApplicationsByTeam: (teamCode: string) => TeamApplication[];
  getUserApplication: (teamCode: string, userId: string) => TeamApplication | undefined;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hackathons: [],
      hackathonDetails: {},
      teams: [],
      leaderboards: {},
      submissions: [],
      rankings: [],
      theme: "light",
      initialized: false,
      dataVersion: 0,
      currentUser: null,
      users: [],
      applications: [],
      participations: [],
      usageLog: [],

      initializeData: () => {
        const state = get();
        if (!state.initialized || state.dataVersion !== DATA_VERSION) {
          set({
            hackathons: SEED_HACKATHONS,
            hackathonDetails: SEED_HACKATHON_DETAILS,
            teams: SEED_TEAMS,
            leaderboards: SEED_LEADERBOARDS,
            rankings: SEED_RANKINGS,
            // Reset all user-created data on version change
            users: [],
            currentUser: null,
            applications: [],
            participations: [],
            submissions: [],
            usageLog: [],
            initialized: true,
            dataVersion: DATA_VERSION,
          });
        }
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
      },

      addTeam: (teamData) => {
        const team: Team = {
          ...teamData,
          teamCode: "T-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ teams: [...state.teams, team] }));
      },

      updateTeam: (teamCode, updates) => {
        set((state) => ({
          teams: state.teams.map((t) => (t.teamCode === teamCode ? { ...t, ...updates } : t)),
        }));
      },

      addSubmission: (submissionData) => {
        const submission: Submission = {
          ...submissionData,
          id: generateId(),
          submittedAt: new Date().toISOString(),
        };
        set((state) => {
          const existing = state.submissions.findIndex(
            (s) =>
              s.hackathonSlug === submissionData.hackathonSlug &&
              s.itemKey === submissionData.itemKey
          );
          if (existing >= 0) {
            const updated = [...state.submissions];
            updated[existing] = submission;
            return { submissions: updated };
          }
          return { submissions: [...state.submissions, submission] };
        });
      },

      getTeamsByHackathon: (slug) => get().teams.filter((t) => t.hackathonSlug === slug),

      getLeaderboard: (slug) => get().leaderboards[slug],

      getHackathonDetail: (slug) => get().hackathonDetails[slug],

      getSubmissions: (hackathonSlug) =>
        get().submissions.filter((s) => s.hackathonSlug === hackathonSlug),

      // Auth
      register: (name, email, password, phone?) => {
        const existing = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) return { error: "이미 사용 중인 이메일입니다." };
        if (phone) {
          const phoneExists = get().users.find((u) => u.phone === phone);
          if (phoneExists) return { error: "이미 해당 전화번호로 가입된 계정이 있습니다." };
        }
        const user: User = {
          id: generateId(),
          name,
          email,
          password,
          phone,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, user], currentUser: user }));
        return user;
      },

      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!user) return null;
        if (user.provider === "google") return null;
        if (user.password !== password) return null;
        set({ currentUser: user });
        return user;
      },

      loginWithGoogle: (name, email, phone?) => {
        const existing = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existing) {
          const updated = { ...existing, name };
          set((state) => ({
            currentUser: updated,
            users: state.users.map((u) => u.id === updated.id ? updated : u),
          }));
          return updated;
        }
        const user: User = {
          id: generateId(),
          name,
          email,
          password: "",
          phone,
          provider: "google",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, user], currentUser: user }));
        return user;
      },

      logout: () => set({ currentUser: null }),

      updateUserProfile: (updates) => {
        set((state) => {
          if (!state.currentUser) return {};
          const updated = { ...state.currentUser, ...updates };
          return {
            currentUser: updated,
            users: state.users.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },

      // Participations
      joinHackathon: (hackathonSlug) => {
        const { currentUser, participations } = get();
        if (!currentUser) return;
        const already = participations.some(
          (p) => p.userId === currentUser.id && p.hackathonSlug === hackathonSlug
        );
        if (already) return;
        set((state) => ({
          participations: [
            ...state.participations,
            { userId: currentUser.id, hackathonSlug, registeredAt: new Date().toISOString() },
          ],
        }));
      },

      // Usage tracking
      getDailyUsage: (userId) => {
        const today = new Date().toISOString().slice(0, 10);
        return (
          get().usageLog.find((u) => u.userId === userId && u.date === today) ?? {
            userId,
            date: today,
            chatCount: 0,
            matchCount: 0,
          }
        );
      },

      incrementChatUsage: (userId) => {
        const today = new Date().toISOString().slice(0, 10);
        const log = get().usageLog;
        const idx = log.findIndex((u) => u.userId === userId && u.date === today);
        const current = idx >= 0 ? log[idx] : { userId, date: today, chatCount: 0, matchCount: 0 };
        if (current.chatCount >= 20) return false;
        const updated: DailyUsage = { ...current, chatCount: current.chatCount + 1 };
        if (idx >= 0) {
          const newLog = [...log];
          newLog[idx] = updated;
          set({ usageLog: newLog });
        } else {
          set((state) => ({ usageLog: [...state.usageLog, updated] }));
        }
        return true;
      },

      incrementMatchUsage: (userId) => {
        const today = new Date().toISOString().slice(0, 10);
        const log = get().usageLog;
        const idx = log.findIndex((u) => u.userId === userId && u.date === today);
        const current = idx >= 0 ? log[idx] : { userId, date: today, chatCount: 0, matchCount: 0 };
        if (current.matchCount >= 5) return false;
        const updated: DailyUsage = { ...current, matchCount: current.matchCount + 1 };
        if (idx >= 0) {
          const newLog = [...log];
          newLog[idx] = updated;
          set({ usageLog: newLog });
        } else {
          set((state) => ({ usageLog: [...state.usageLog, updated] }));
        }
        return true;
      },

      // Applications
      addApplication: (appData) => {
        const app: TeamApplication = {
          ...appData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ applications: [...state.applications, app] }));
      },

      updateApplicationStatus: (id, status) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        }));
      },

      getApplicationsByTeam: (teamCode) =>
        get().applications.filter((a) => a.teamCode === teamCode),

      getUserApplication: (teamCode, userId) =>
        get().applications.find(
          (a) => a.teamCode === teamCode && a.applicantId === userId
        ),
    }),
    {
      name: "dcoder-hub-store",
      skipHydration: true,
    }
  )
);
