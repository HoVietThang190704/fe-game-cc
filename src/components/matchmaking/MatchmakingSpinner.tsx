"use client";

import { Swords } from "lucide-react";

export function MatchmakingSpinner() {
  return (
    <div className="matchmaking-spinner-container relative mb-5 flex h-[8rem] w-[8rem] items-center justify-center sm:h-[9rem] sm:w-[9rem]">
      {/* Outer ring - darker, slower */}
      <div className="matchmaking-spinner-ring matchmaking-spinner-ring-outer" aria-hidden />
      {/* Inner ring - brighter, faster */}
      <div className="matchmaking-spinner-ring matchmaking-spinner-ring-inner" aria-hidden />
      {/* Center glow halo */}
      <div className="matchmaking-spinner-halo" aria-hidden />
      {/* Centered icon — must stay inside this relative box so it aligns with rings */}
      <div className="relative z-10 flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-600 shadow-[0_0_32px_rgba(34,211,238,0.65)] sm:h-[4.25rem] sm:w-[4.25rem]">
        <Swords className="h-8 w-8 text-white drop-shadow-md sm:h-9 sm:w-9" strokeWidth={2} />
      </div>
    </div>
  );
}
