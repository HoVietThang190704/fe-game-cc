import { useState, useCallback } from "react";
import type { MatchHistoryItem, MatchStats } from "../interface/match.interface";
import { getMatchHistory } from "../api/match-history";

interface UseMatchHistoryReturn {
  matches: MatchHistoryItem[];
  stats: MatchStats | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  total: number;
  error: string | null;
  fetchMatches: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useMatchHistory(): UseMatchHistoryReturn {
  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMatchHistory(1);
      setMatches(response.items);
      setStats(response.stats);
      setHasMore(response.hasMore);
      setTotal(response.total);
      setPage(1);
    } catch {
      setError("Không thể tải lịch sử đấu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getMatchHistory(nextPage);
      setMatches((prev) => [...prev, ...response.items]);
      setHasMore(response.hasMore);
      setTotal(response.total);
      setPage(nextPage);
    } catch {
      setError("Không thể tải thêm trận đấu.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page]);

  return {
    matches,
    stats,
    isLoading,
    isLoadingMore,
    hasMore,
    total,
    error,
    fetchMatches,
    loadMore,
  };
}
