"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { StatsSummaryCards } from "../../../components/match-history/StatsSummaryCards";
import { MatchList } from "../../../components/match-history/MatchList";
import { useMatchHistory } from "../../../lib/hooks/useMatchHistory";
import { useEffect } from "react";

export default function MatchHistoryPage() {
  const { matches, stats, isLoading, isLoadingMore, hasMore, error, fetchMatches, loadMore } =
    useMatchHistory();

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #4a1d70, #35155a, #1a0a2e)",
      }}
    >
      {/* ── Fixed header with solid background to mask scrolled cards ── */}
      <header
        className="flex shrink-0 flex-col gap-0"
        style={{ background: "#4a1d70" }}
      >
        {/* Row 1: back button flush left */}
        <div className="flex items-center px-3 py-2">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/[0.12] px-2 py-1.5 text-xs font-medium text-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition hover:border-white/40 hover:bg-white/[0.18]"
          >
            <span
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/[0.08]"
              aria-hidden
            >
              <ArrowLeft className="size-3.5" />
            </span>
            Quay lại hồ sơ
          </Link>
        </div>

        {/* Row 2: title card */}
        <div className="mx-auto w-full max-w-2xl px-3 pb-3 pt-2">
          <div
            className="w-full rounded-2xl border border-white/20 bg-white/[0.1] px-4 py-3 text-center shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-md"
          >
            <h1 className="text-base font-bold tracking-tight sm:text-lg text-white">
              Lịch sử trận đấu
            </h1>
            <p className="mt-0.5 text-xs text-white/70">
              Xem lại các trận đã chơi
            </p>
          </div>

          {/* Row 3: stats */}
          <div className="pt-3">
            {stats && <StatsSummaryCards stats={stats} />}
          </div>
        </div>
      </header>

      {/* ── Scrollable match list ── */}
      <main className="mx-auto flex h-0 min-h-0 w-full max-w-2xl flex-1 flex-col overflow-hidden px-3 pb-10">
        <h2 className="shrink-0 pt-5 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          Các trận gần đây
        </h2>

        <MatchList
          matches={matches}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          onLoadMore={loadMore}
          onRetry={fetchMatches}
          className="flex-1 overflow-hidden"
        />
      </main>
    </div>
  );
}
