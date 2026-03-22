"use client";

import { useRef } from "react";
import { RotateCcw } from "lucide-react";

import { MatchItem } from "./MatchItem";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty";
import { cn } from "../../lib/utils";
import type { MatchHistoryItem } from "../../lib/interface/match.interface";

interface MatchListProps {
  matches: MatchHistoryItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  onRetry: () => void;
  className?: string;
}

function MatchListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/[0.1] px-3 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-md"
        >
          <Skeleton className="h-10 w-12 shrink-0 rounded-lg bg-white/10" />
          <Skeleton className="size-10 shrink-0 rounded-full bg-white/10" />
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="h-3 w-16 bg-white/10" />
          </div>
          <div className="hidden flex-col gap-1.5 sm:flex">
            <Skeleton className="h-3 w-20 bg-white/10" />
            <Skeleton className="h-3 w-14 bg-white/10" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-5 w-14 bg-white/10" />
            <Skeleton className="h-3 w-16 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MatchList({
  matches,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onLoadMore,
  onRetry,
  className,
}: MatchListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className={cn("flex w-full flex-col gap-3", className)}>
        <MatchListSkeleton />
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className={cn("flex w-full flex-col items-center gap-4 py-8", className)}>
        <Empty className="max-w-xs text-white">
          <EmptyMedia variant="icon">
            <RotateCcw className="size-6 text-white/80" />
          </EmptyMedia>
          <EmptyContent>
            <EmptyTitle className="text-white">Không thể tải dữ liệu</EmptyTitle>
            <EmptyDescription className="text-white/70">{error}</EmptyDescription>
          </EmptyContent>
        </Empty>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="rounded-xl border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15"
        >
          <RotateCcw className="size-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <Empty className="py-12 text-white">
          <EmptyContent>
            <EmptyTitle className="text-white">Chưa có trận đấu nào</EmptyTitle>
            <EmptyDescription className="text-white/70">
              Hãy tham gia các trận đấu để xây dựng lịch sử của bạn.
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className={cn("flex h-0 min-h-0 w-full flex-1 flex-col overflow-hidden", className)}>
      <ScrollArea className="flex-1" type="scroll">
        <div className="flex w-full flex-col gap-4 pr-2">
          {matches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))}
        </div>
      </ScrollArea>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center pt-1">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="min-h-10 min-w-[160px] rounded-xl border border-white/20 bg-white/[0.1] px-6 text-sm font-semibold text-white shadow-[0_8px_40px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.12]"
          >
            {isLoadingMore ? (
              <>
                <Spinner className="size-4" />
                Đang tải...
              </>
            ) : (
              "Xem thêm"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
