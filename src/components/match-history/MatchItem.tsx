"use client";

import { format } from "date-fns";
import {
  Crosshair,
  Gamepad2,
  Calendar,
  Clock,
} from "lucide-react";

import { cn } from "../../lib/utils";
import type { MatchHistoryItem } from "../../lib/interface/match.interface";

interface MatchItemProps {
  match: MatchHistoryItem;
  className?: string;
}

const MODE_ICONS = {
  RANKED: Crosshair,
  QUICK: Gamepad2,
} as const;

function formatDurationClock(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function EloBlock({
  change,
  eloAfter,
}: {
  change: number;
  eloAfter: number;
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const eloLine = isNeutral
    ? "0"
    : `${isPositive ? "+" : ""}${change}`;

  return (
    <div className="flex shrink-0 flex-col items-end justify-center gap-0.5 text-right">
      <span
        className={cn(
          "text-base font-extrabold tabular-nums leading-none tracking-tight sm:text-lg",
          isNeutral && "text-white/60",
          isPositive && "text-[#39ff14] drop-shadow-[0_0_12px_rgba(57,255,20,0.45)]",
          !isNeutral &&
            !isPositive &&
            "text-[#ff3b5c] drop-shadow-[0_0_12px_rgba(255,59,92,0.45)]"
        )}
      >
        {eloLine}
      </span>
      <span className="text-[10px] leading-none text-white/45">
        ELO · {eloAfter}
      </span>
    </div>
  );
}

function MatchItemContent({ match }: { match: MatchHistoryItem }) {
  const isWin = match.matchResult === "WIN";
  const matchDate = format(new Date(match.playedAt), "dd/MM/yyyy");
  const durationClock = formatDurationClock(match.durationMinutes);
  const ModeIcon = MODE_ICONS[match.mode];

  return (
    <>
      {/* Win/Loss badge */}
      <div
        className={cn(
          "flex h-8 w-10 shrink-0 items-center justify-center rounded-lg text-center text-[9px] font-extrabold uppercase leading-tight tracking-wide",
          isWin
            ? "border border-emerald-400/50 bg-emerald-500/25 text-[#7dff9a] shadow-[0_0_12px_rgba(34,197,94,0.2)]"
            : "border border-red-400/45 bg-red-500/25 text-[#ff8a9a] shadow-[0_0_12px_rgba(239,68,68,0.18)]"
        )}
      >
        {isWin ? "THẮNG" : "THUA"}
      </div>

      {/* Mode icon */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-500/35 ring-2 ring-sky-300/40 shadow-[0_0_16px_rgba(56,189,248,0.2)]">
        <ModeIcon className="size-5 text-sky-100" aria-hidden />
      </div>

      {/* Opponent + score — center-aligned */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
        <p className="truncate text-sm font-semibold text-white">
          vs {match.opponent.name}
        </p>
        <p className="text-xs font-bold tabular-nums text-white/80">
          {match.myScore} — {match.opponentScore}
        </p>
      </div>

      {/* Date + duration */}
      <div className="hidden shrink-0 flex-col gap-1.5 text-[11px] text-white/70 sm:flex">
        <div className="flex items-center gap-1">
          <Calendar className="size-3 shrink-0 text-violet-200/80" />
          <span className="tabular-nums">{matchDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="size-3 shrink-0 text-violet-200/80" />
          <span className="tabular-nums">{durationClock}</span>
        </div>
      </div>

      <EloBlock change={match.eloChange} eloAfter={match.eloAfter} />
    </>
  );
}

export function MatchItem({ match, className }: MatchItemProps) {
  return (
    <div
      className={cn(
        "group relative flex w-full min-w-0 items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.1] px-3 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-md transition-all",
        "hover:border-white/30 hover:bg-white/[0.12] hover:shadow-[0_12px_36px_rgba(88,28,135,0.35)]",
        className
      )}
    >
      <MatchItemContent match={match} />
    </div>
  );
}
