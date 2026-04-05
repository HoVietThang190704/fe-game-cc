export type MatchResult = "WIN" | "LOSS";

export type MatchMode = "QUICK" | "RANKED";

export interface PlayerInfo {
  id: number;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface MatchHistoryItem {
  id: string;
  matchResult: MatchResult;
  mode: MatchMode;
  myScore: number;
  opponentScore: number;
  opponent: PlayerInfo;
  eloBefore: number;
  eloAfter: number;
  eloChange: number;
  durationMinutes: number;
  playedAt: string;
}

export interface MatchStats {
  totalWins: number;
  totalLosses: number;
  winRate: number;
  averageMatchDuration: number;
}

export interface MatchHistoryResponse {
  items: MatchHistoryItem[];
  stats: MatchStats;
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
