"use client";

import { Lightbulb } from "lucide-react";

export function MatchmakingTips() {
  return (
    <p className="matchmaking-tip mt-6 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-cyan-200/65 sm:text-sm">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" />
      <span>Mẹo: Thời gian tìm trận nhanh hơn vào giờ cao điểm</span>
    </p>
  );
}
