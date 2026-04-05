"use client";

export function MatchmakingDots() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      <span className="matchmaking-dot h-2 w-2 rounded-full bg-cyan-400" />
      <span className="matchmaking-dot matchmaking-dot--2 h-2 w-2 rounded-full bg-cyan-400" />
      <span className="matchmaking-dot matchmaking-dot--3 h-2 w-2 rounded-full bg-cyan-400" />
    </div>
  );
}
