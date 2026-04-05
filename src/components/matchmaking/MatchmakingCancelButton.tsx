"use client";

interface MatchmakingCancelButtonProps {
  onClick: () => void;
}

export function MatchmakingCancelButton({ onClick }: MatchmakingCancelButtonProps) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="matchmaking-cancel-btn relative w-full overflow-hidden rounded-2xl border border-cyan-400/35 bg-white/[0.06] py-3.5 text-center text-sm font-semibold text-cyan-100 transition-all duration-200 hover:border-cyan-300/55 hover:bg-cyan-500/15 hover:text-white active:scale-[0.99] sm:w-[280px]"
      >
        <span className="relative z-10">Hủy tìm kiếm</span>
        <div className="matchmaking-btn-glow" aria-hidden />
      </button>
    </div>
  );
}
