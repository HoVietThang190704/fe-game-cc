"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { dashboardInitialState } from "@/src/components/dashboard/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { useMatchmakingSocket } from "@/src/lib/socket/useMatchmakingSocket";
import { MatchmakingSpinner } from "./MatchmakingSpinner";
import { MatchmakingDots } from "./MatchmakingDots";
import { MatchmakingPlayerCard } from "./MatchmakingPlayerCard";
import { MatchmakingStatusBars } from "./MatchmakingStatusBars";
import { MatchmakingCancelButton } from "./MatchmakingCancelButton";
import { MatchmakingTips } from "./MatchmakingTips";

interface MatchmakingScreenProps {
  onCancel?: () => void;
}

export function MatchmakingScreen({ onCancel }: MatchmakingScreenProps) {
  const router = useRouter();
  const { data } = useDashboardData();
  const player = data?.player ?? dashboardInitialState.player;

  const { matchId, searchDuration, connect, disconnect } = useMatchmakingSocket();

  useEffect(() => {
    if (matchId) {
      router.push(`/matchfound?matchId=${matchId}`);
    }
  }, [matchId, router]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = useCallback(() => {
    disconnect();
    if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard");
    }
  }, [disconnect, router, onCancel]);

  return (
    <div className="matchmaking-root relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Background decorative glows */}
      <div className="matchmaking-bg-glow matchmaking-bg-glow-1" aria-hidden />
      <div className="matchmaking-bg-glow matchmaking-bg-glow-2" aria-hidden />
      <div className="matchmaking-bg-glow matchmaking-bg-glow-3" aria-hidden />

      <div className="relative z-10 w-full max-w-[min(100%,40rem)]">
        <header className="mb-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Đang tìm đối thủ...</h1>
          <p className="text-sm text-cyan-300/90 sm:text-[0.9375rem]">
            Hệ thống đang ghép bạn với người chơi cùng trình độ
          </p>
        </header>

        <div className="matchmaking-glass relative w-full overflow-hidden rounded-3xl border border-cyan-400/25 bg-[rgba(6,22,32,0.45)] p-6 shadow-[0_8px_48px_rgba(0,40,60,0.55)] backdrop-blur-xl sm:p-8">
          {/* Spinner + Dots */}
          <div className="flex flex-col items-center">
            <MatchmakingSpinner />
            <div className="mt-4">
              <MatchmakingDots />
            </div>
          </div>

          {/* Player Card */}
          <section className="my-5">
            <MatchmakingPlayerCard username={player.username} elo={player.elo} />
          </section>

          {/* Status Bars */}
          <MatchmakingStatusBars searchDuration={searchDuration} />

          {/* Cancel Button */}
          <MatchmakingCancelButton onClick={handleCancel} />
        </div>

        {/* Tips */}
        <MatchmakingTips />
      </div>
    </div>
  );
}
