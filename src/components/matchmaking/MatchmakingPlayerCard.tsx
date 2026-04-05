"use client";

import { Gamepad2, Trophy } from "lucide-react";

interface MatchmakingPlayerCardProps {
  username: string;
  elo: number;
}

export function MatchmakingPlayerCard({ username, elo }: MatchmakingPlayerCardProps) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-5 backdrop-blur-md sm:px-6">
      <p className="mb-3 text-center text-sm font-semibold tracking-wide text-white/80 sm:text-base">
        Thông tin của bạn
      </p>
      <div className="flex items-center justify-center gap-4 sm:gap-5">
        {/* Avatar with enhanced cyan glow */}
        <div className="matchmaking-avatar-glow relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-teal-600/30">
            <Gamepad2 className="h-7 w-7 text-cyan-200" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[1.3rem] leading-tight font-extrabold text-white sm:text-[1.7rem]">
            {username}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-amber-300">
            <Trophy className="h-4 w-4 shrink-0 text-amber-400" />
            {elo} ELO
          </p>
        </div>
      </div>
    </div>
  );
}
