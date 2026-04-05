"use client";

import { Clock } from "lucide-react";

interface MatchmakingStatusBarsProps {
  searchDuration: number;
}

function EstimatedTime({ searchDuration }: { searchDuration: number }) {
  let estimate: string;
  if (searchDuration < 10) estimate = "5-15 giây";
  else if (searchDuration < 30) estimate = "15-30 giây";
  else if (searchDuration < 60) estimate = "30-60 giây";
  else estimate = "1-2 phút";

  return <span className="font-semibold text-cyan-200">{estimate}</span>;
}

export function MatchmakingStatusBars({ searchDuration }: MatchmakingStatusBarsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="matchmaking-status-bar flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-center backdrop-blur-md sm:px-6">
        <Clock className="h-5 w-5 shrink-0 text-cyan-300/80" />
        <p className="text-sm font-medium text-white/85">
          Đã tìm kiếm:{" "}
          <span className="font-semibold text-cyan-200">{searchDuration} giây</span>
        </p>
      </div>
      <div className="matchmaking-status-bar flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-center backdrop-blur-md sm:px-6">
        <Clock className="h-5 w-5 shrink-0 text-cyan-300/80" />
        <p className="text-sm font-medium text-white/85">
          Thời gian chờ ước tính: <EstimatedTime searchDuration={searchDuration} />
        </p>
      </div>
    </div>
  );
}
