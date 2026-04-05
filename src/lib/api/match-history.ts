import type {
  MatchHistoryItem,
  MatchHistoryResponse,
  MatchStats,
} from "../interface/match.interface";
import { Endpoint } from "../shared/constants/endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type BaseResponse<T> = {
  message: string;
  success: boolean;
  data?: T;
};

// ── Auth token helpers ──────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  const body = (await res.json()) as BaseResponse<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return body.data as T;
}

// ── Mock data (development fallback) ─────────────────────────────────────────

const MOCK_STATS: MatchStats = {
  totalWins: 12,
  totalLosses: 8,
  winRate: 60,
  averageMatchDuration: 8.5,
};

const MOCK_MATCHES: MatchHistoryItem[] = [
  {
    id: "m-001",
    matchResult: "WIN",
    mode: "RANKED",
    myScore: 15,
    opponentScore: 9,
    opponent: {
      id: 2,
      name: "Dragon Slayer",
      username: "dragonslayer",
      avatarUrl: "https://i.pravatar.cc/150?img=11",
    },
    eloBefore: 1250,
    eloAfter: 1285,
    eloChange: 35,
    durationMinutes: 12,
    playedAt: "2026-03-20T14:30:00Z",
  },
  {
    id: "m-002",
    matchResult: "LOSS",
    mode: "RANKED",
    myScore: 8,
    opponentScore: 15,
    opponent: {
      id: 3,
      name: "Shadow Master",
      username: "shadowmaster",
      avatarUrl: "https://i.pravatar.cc/150?img=33",
    },
    eloBefore: 1270,
    eloAfter: 1250,
    eloChange: -20,
    durationMinutes: 10,
    playedAt: "2026-03-20T12:15:00Z",
  },
  {
    id: "m-003",
    matchResult: "WIN",
    mode: "QUICK",
    myScore: 15,
    opponentScore: 11,
    opponent: {
      id: 4,
      name: "Cyber Punk",
      username: "cyberpunk",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
    eloBefore: 1270,
    eloAfter: 1270,
    eloChange: 0,
    durationMinutes: 7,
    playedAt: "2026-03-19T21:00:00Z",
  },
  {
    id: "m-004",
    matchResult: "WIN",
    mode: "RANKED",
    myScore: 15,
    opponentScore: 13,
    opponent: {
      id: 5,
      name: "Iron Fist",
      username: "ironfist",
      avatarUrl: "https://i.pravatar.cc/150?img=13",
    },
    eloBefore: 1240,
    eloAfter: 1270,
    eloChange: 30,
    durationMinutes: 15,
    playedAt: "2026-03-19T18:45:00Z",
  },
  {
    id: "m-005",
    matchResult: "LOSS",
    mode: "RANKED",
    myScore: 10,
    opponentScore: 15,
    opponent: {
      id: 6,
      name: "Neon Rider",
      username: "neonrider",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
    },
    eloBefore: 1265,
    eloAfter: 1240,
    eloChange: -25,
    durationMinutes: 9,
    playedAt: "2026-03-19T15:30:00Z",
  },
  {
    id: "m-006",
    matchResult: "WIN",
    mode: "QUICK",
    myScore: 15,
    opponentScore: 5,
    opponent: {
      id: 7,
      name: "Pixel Hunter",
      username: "pixelhunter",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
    },
    eloBefore: 1265,
    eloAfter: 1265,
    eloChange: 0,
    durationMinutes: 5,
    playedAt: "2026-03-18T22:00:00Z",
  },
  {
    id: "m-007",
    matchResult: "LOSS",
    mode: "RANKED",
    myScore: 12,
    opponentScore: 15,
    opponent: {
      id: 8,
      name: "Storm Chaser",
      username: "stormchaser",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
    },
    eloBefore: 1290,
    eloAfter: 1265,
    eloChange: -25,
    durationMinutes: 14,
    playedAt: "2026-03-18T19:00:00Z",
  },
  {
    id: "m-008",
    matchResult: "WIN",
    mode: "RANKED",
    myScore: 15,
    opponentScore: 7,
    opponent: {
      id: 9,
      name: "Frost Byte",
      username: "frostbyte",
      avatarUrl: "https://i.pravatar.cc/150?img=25",
    },
    eloBefore: 1260,
    eloAfter: 1290,
    eloChange: 30,
    durationMinutes: 8,
    playedAt: "2026-03-18T16:00:00Z",
  },
  {
    id: "m-009",
    matchResult: "WIN",
    mode: "QUICK",
    myScore: 15,
    opponentScore: 14,
    opponent: {
      id: 10,
      name: "Thunder Wolf",
      username: "thunderwolf",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    eloBefore: 1260,
    eloAfter: 1260,
    eloChange: 0,
    durationMinutes: 11,
    playedAt: "2026-03-17T20:30:00Z",
  },
  {
    id: "m-010",
    matchResult: "LOSS",
    mode: "RANKED",
    myScore: 11,
    opponentScore: 15,
    opponent: {
      id: 11,
      name: "Void Walker",
      username: "voidwalker",
      avatarUrl: "https://i.pravatar.cc/150?img=52",
    },
    eloBefore: 1285,
    eloAfter: 1260,
    eloChange: -25,
    durationMinutes: 13,
    playedAt: "2026-03-17T17:00:00Z",
  },
  {
    id: "m-011",
    matchResult: "WIN",
    mode: "RANKED",
    myScore: 15,
    opponentScore: 10,
    opponent: {
      id: 12,
      name: "Blaze Storm",
      username: "blazestorm",
      avatarUrl: "https://i.pravatar.cc/150?img=60",
    },
    eloBefore: 1255,
    eloAfter: 1285,
    eloChange: 30,
    durationMinutes: 9,
    playedAt: "2026-03-16T21:00:00Z",
  },
  {
    id: "m-012",
    matchResult: "LOSS",
    mode: "QUICK",
    myScore: 9,
    opponentScore: 15,
    opponent: {
      id: 13,
      name: "Night Fury",
      username: "nightfury",
      avatarUrl: "https://i.pravatar.cc/150?img=47",
    },
    eloBefore: 1255,
    eloAfter: 1255,
    eloChange: 0,
    durationMinutes: 7,
    playedAt: "2026-03-16T18:30:00Z",
  },
  {
    id: "m-013",
    matchResult: "WIN",
    mode: "RANKED",
    myScore: 15,
    opponentScore: 12,
    opponent: {
      id: 14,
      name: "Mystic Ray",
      username: "mysticray",
      avatarUrl: "https://i.pravatar.cc/150?img=44",
    },
    eloBefore: 1225,
    eloAfter: 1255,
    eloChange: 30,
    durationMinutes: 14,
    playedAt: "2026-03-15T20:00:00Z",
  },
  {
    id: "m-014",
    matchResult: "LOSS",
    mode: "RANKED",
    myScore: 13,
    opponentScore: 15,
    opponent: {
      id: 15,
      name: "Rocket Man",
      username: "rocketman",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    eloBefore: 1250,
    eloAfter: 1225,
    eloChange: -25,
    durationMinutes: 10,
    playedAt: "2026-03-15T15:00:00Z",
  },
  {
    id: "m-015",
    matchResult: "WIN",
    mode: "QUICK",
    myScore: 15,
    opponentScore: 3,
    opponent: {
      id: 16,
      name: "Lunar Cat",
      username: "lunarcat",
      avatarUrl: "https://i.pravatar.cc/150?img=16",
    },
    eloBefore: 1250,
    eloAfter: 1250,
    eloChange: 0,
    durationMinutes: 4,
    playedAt: "2026-03-14T22:00:00Z",
  },
];

const PAGE_SIZE = 5;

function getMockResponse(page: number): MatchHistoryResponse {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return {
    items: MOCK_MATCHES.slice(start, end),
    stats: MOCK_STATS,
    total: MOCK_MATCHES.length,
    page,
    pageSize: PAGE_SIZE,
    hasMore: end < MOCK_MATCHES.length,
  };
}

// ── Real API functions ──────────────────────────────────────────────────────

async function fetchMatchHistoryFromApi(
  page: number,
): Promise<MatchHistoryResponse> {
  return apiFetch<MatchHistoryResponse>(
    `${Endpoint.MATCH_HISTORY}?page=${page}&pageSize=${PAGE_SIZE}`,
  );
}

// ── Public API: tries real endpoint, falls back to mock ────────────────────

export async function getMatchHistory(
  page: number = 1,
): Promise<MatchHistoryResponse> {
  try {
    return await fetchMatchHistoryFromApi(page);
  } catch {
    return getMockResponse(page);
  }
}
