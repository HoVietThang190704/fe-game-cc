"use client";

import { Trophy, Crosshair, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import type { MatchStats } from "../../lib/interface/match.interface";

interface StatsSummaryCardsProps {
  stats: MatchStats;
  className?: string;
}

function formatAvgDuration(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface StatCardData {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  valueClass: string;
  iconClass: string;
  iconWrapClass: string;
}

function StatCard({
  data,
  className,
}: {
  data: StatCardData;
  className?: string;
}) {
  const Icon = data.icon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start gap-2 rounded-2xl border border-white/20 bg-white/[0.1] px-3 py-3 text-center shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-md",
        className
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          data.iconWrapClass
        )}
      >
        <Icon className={cn("size-4", data.iconClass)} />
      </div>
      <span
        className={cn(
          "text-2xl font-extrabold tabular-nums tracking-tight",
          data.valueClass
        )}
      >
        {data.value}
      </span>
      <span className="text-[10px] font-medium leading-tight text-white/75">
        {data.label}
      </span>
    </div>
  );
}

export function StatsSummaryCards({ stats, className }: StatsSummaryCardsProps) {
  const cards: StatCardData[] = [
    {
      label: "Trận thắng",
      value: stats.totalWins,
      icon: Trophy,
      valueClass: "text-[#39ff14] drop-shadow-[0_0_12px_rgba(57,255,20,0.45)]",
      iconWrapClass: "bg-amber-400/20 ring-1 ring-amber-300/30",
      iconClass: "text-amber-300",
    },
    {
      label: "Trận thua",
      value: stats.totalLosses,
      icon: Crosshair,
      valueClass: "text-[#ff3b5c] drop-shadow-[0_0_12px_rgba(255,59,92,0.45)]",
      iconWrapClass: "bg-red-500/20 ring-1 ring-red-400/35",
      iconClass: "text-red-400",
    },
    {
      label: "Thời gian TB",
      value: formatAvgDuration(stats.averageMatchDuration),
      icon: Clock,
      valueClass:
        "text-[#c4b5fd] drop-shadow-[0_0_12px_rgba(196,181,253,0.35)]",
      iconWrapClass: "bg-violet-500/25 ring-1 ring-violet-300/35",
      iconClass: "text-violet-200",
    },
  ];

  return (
    <div className="w-full">
      <div
        className={cn(
          "grid grid-cols-3 gap-2 [&>*]:min-w-0",
          className
        )}
      >
        {cards.map((card) => (
          <StatCard key={card.label} data={card} className="!px-2 !py-2" />
        ))}
      </div>
    </div>
  );
}
