"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, Gamepad2, Lightbulb, Swords, Trophy } from "lucide-react";
import { dashboardInitialState } from "@/src/components/dashboard/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { useMatchmakingSocket } from "@/src/lib/socket/useMatchmakingSocket";

function EstimatedTime({ searchDuration }: { searchDuration: number }) {
  let estimate: string;
  if (searchDuration < 10) estimate = "5-15 giây";
  else if (searchDuration < 30) estimate = "15-30 giây";
  else if (searchDuration < 60) estimate = "30-60 giây";
  else estimate = "1-2 phút";

  return <span className="font-semibold text-cyan-200">{estimate}</span>;
}

export function MatchmakingWaitScreen() {
  const router = useRouter();
  const { data } = useDashboardData();
  const player = data?.player ?? dashboardInitialState.player;

  const { matchId, searchDuration, status, error, connect, disconnect } = useMatchmakingSocket();

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
    router.push("/dashboard");
  }, [disconnect, router]);

  return (
    <div className="matchmaking-root relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="relative z-10 w-full max-w-[min(100%,40rem)]">
        <header className="mb-6 flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Đang tìm đối thủ...</h1>
          <p className="text-sm text-cyan-300/90 sm:text-[0.9375rem]">
            Hệ thống đang ghép bạn với người chơi cùng trình độ
          </p>
        </header>

        <div className="matchmaking-glass relative w-full overflow-hidden rounded-3xl border border-cyan-400/25 bg-[rgba(6,22,32,0.45)] p-6 shadow-[0_8px_48px_rgba(0,40,60,0.55)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center">
            <div className="matchmaking-spinner-container relative mb-5 flex h-[7.5rem] w-[7.5rem] items-center justify-center sm:h-[8.5rem] sm:w-[8.5rem]">
              <div
                className="matchmaking-spinner-ring pointer-events-none absolute inset-0 rounded-full"
                aria-hidden
              />
              <div className="relative z-10 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 shadow-[0_0_28px_rgba(34,211,238,0.55)] sm:h-[4.75rem] sm:w-[4.75rem]">
                <Swords className="h-9 w-9 text-white drop-shadow-md sm:h-10 sm:w-10" strokeWidth={2} />
              </div>
            </div>

            <div className="flex gap-1.5" aria-hidden>
              <span className="matchmaking-dot h-2 w-2 rounded-full bg-cyan-400" />
              <span className="matchmaking-dot matchmaking-dot--2 h-2 w-2 rounded-full bg-cyan-400" />
              <span className="matchmaking-dot matchmaking-dot--3 h-2 w-2 rounded-full bg-cyan-400" />
            </div>
          </div>

          <section className="my-5">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-5 backdrop-blur-md sm:px-6">
              <p className="mb-3 text-center text-sm font-semibold tracking-wide text-white/80 sm:text-base">
                Thông tin của bạn
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.45)] ring-2 ring-cyan-400/40">
                  <Gamepad2 className="h-7 w-7 text-cyan-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[1.3rem] leading-tight font-extrabold text-white sm:text-[1.7rem]">
                    {player.username}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-amber-300">
                    <Trophy className="h-4 w-4 shrink-0 text-amber-400" />
                    {player.elo} ELO
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-center backdrop-blur-md sm:px-6">
              <Clock className="h-5 w-5 shrink-0 text-cyan-300/80" />
              <p className="text-sm font-medium text-white/85">
                Đã tìm kiếm:{" "}
                <span className="font-semibold text-cyan-200">{searchDuration} giây</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-center backdrop-blur-md sm:px-6">
              <Clock className="h-5 w-5 shrink-0 text-cyan-300/80" />
              <p className="text-sm font-medium text-white/85">
                Thời gian chờ ước tính: <EstimatedTime searchDuration={searchDuration} />
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleCancel}
              className="matchmaking-cancel-btn w-full rounded-2xl border border-cyan-400/35 bg-white/[0.06] py-3.5 text-center text-sm font-semibold text-cyan-100 transition-colors duration-200 hover:border-cyan-300/55 hover:bg-cyan-500/15 hover:text-white active:scale-[0.99] sm:w-[280px]"
            >
              Hủy tìm kiếm
            </button>
          </div>
        </div>

        <p className="mt-6 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-cyan-200/65 sm:text-sm">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" />
          <span>Mẹo: Thời gian tìm trận nhanh hơn vào giờ cao điểm</span>
        </p>
      </div>
    </div>
  );
}
