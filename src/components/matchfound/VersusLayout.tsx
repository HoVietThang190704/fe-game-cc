"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Swords, Zap, Heart, Timer, LayoutGrid } from "lucide-react";
import { useMatchmakingSocket } from "@/src/lib/socket/useMatchmakingSocket";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { dashboardInitialState } from "@/src/components/dashboard/dashboard-data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PlayerCardData {
  username: string;
  elo: number;
  avatarUrl?: string;
}

interface MatchSettings {
  rows: number;
  cols: number;
  bombs: number;
  health: number;
  turnTime: number;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

/** Round icon circle used as avatar placeholder */
function IconCircle({
  icon: Icon,
  bgFrom,
  bgTo,
  iconColor = "text-white",
  size = "md",
}: {
  icon: React.ElementType;
  bgFrom: string;
  bgTo: string;
  iconColor?: string;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm"
    ? "h-14 w-14"
    : "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]";
  const iconSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <div
      className={`${sizeClasses} flex shrink-0 items-center justify-center rounded-full`}
      style={{
        background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})`,
        boxShadow: `0 0 20px ${bgFrom}66, 0 0 8px ${bgFrom}33`,
      }}
    >
      <Icon className={`${iconSize} ${iconColor}`} strokeWidth={2.2} />
    </div>
  );
}

/** Player label pill (Bạn / Đối thủ) */
function PlayerLabel({ label }: { label: string }) {
  const isYou = label === "Bạn";
  return (
    <span
      className="inline-block rounded-full px-3 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider sm:px-4 sm:py-1 sm:text-xs"
      style={{
        background: isYou ? "rgba(34,211,238,0.15)" : "rgba(248,113,113,0.15)",
        color: isYou ? "#67e8f9" : "#fca5a5",
        border: `1px solid ${isYou ? "rgba(34,211,238,0.3)" : "rgba(248,113,113,0.3)"}`,
      }}
    >
      {label}
    </span>
  );
}

/** Player card — left or right aligned */
function PlayerCard({
  player,
  align,
  label,
  icon,
  bgFrom,
  bgTo,
  iconColor,
}: {
  player: PlayerCardData;
  align: "left" | "right";
  label: string;
  icon: React.ElementType;
  bgFrom: string;
  bgTo: string;
  iconColor?: string;
}) {
  const isLeft = align === "left";

  return (
    <div
      className={`vs-player-card flex items-center gap-3 sm:gap-4 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
      style={{
        animation: isLeft
          ? "slideFromLeft 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both"
          : "slideFromRight 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both",
      }}
    >
      {/* Avatar icon circle */}
      <IconCircle
        icon={icon}
        bgFrom={bgFrom}
        bgTo={bgTo}
        iconColor={iconColor}
        size="md"
      />

      {/* Info */}
      <div
        className={`flex flex-col gap-1 ${isLeft ? "items-start" : "items-end"} min-w-0`}
      >
        <PlayerLabel label={label} />
        <p className="truncate text-[1.25rem] font-extrabold leading-tight text-white sm:text-[1.5rem]">
          {player.username}
        </p>
        <div
          className={`flex items-center gap-1 ${isLeft ? "" : "flex-row-reverse"}`}
        >
          <Zap className="h-4 w-4 text-yellow-400" strokeWidth={2.5} />
          <span className="text-sm font-bold text-yellow-300 sm:text-base">
            {player.elo} ELO
          </span>
        </div>
      </div>
    </div>
  );
}

/** Animated SVG countdown ring */
function CountdownRing({ count }: { count: number }) {
  const RADIUS = 54;
  const SIZE = 120;
  const STROKE = 6;
  const circumference = 2 * Math.PI * RADIUS;
  const offset = circumference - (count / 2) * circumference;

  return (
    <div
      className="vs-countdown-wrapper relative flex items-center justify-center"
      style={{ width: 120, height: 120 }}
    >
      {/* Outer soft glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-xl"
        style={{ background: "rgba(34,211,238,0.15)" }}
      />

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#cdGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="vs-countdown-arc transition-all duration-500 ease-linear"
        />
        <defs>
          <linearGradient id="cdGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center number */}
      <span
        key={count}
        className="vs-countdown-num absolute inset-0 flex items-center justify-center text-[2.8rem] font-black text-white"
        style={{ textShadow: "0 0 24px rgba(34,211,238,0.7)" }}
      >
        {count}
      </span>
    </div>
  );
}

/** Match settings row — 4 cells horizontally */
function MatchSettingsRow({ settings }: { settings: MatchSettings }) {
  const items = [
    {
      icon: LayoutGrid,
      label: "Bản đồ",
      value: `${settings.rows}x${settings.cols}`,
      color: "#a78bfa",
    },
    {
      icon: Heart,
      label: "Số bom",
      value: `${settings.bombs}`,
      color: "#f87171",
    },
    {
      icon: Heart,
      label: "Máu",
      value: `${settings.health} ❤️`,
      color: "#fb7185",
    },
    {
      icon: Timer,
      label: "Thời gian",
      value: `${settings.turnTime}s`,
      color: "#67e8f9",
    },
  ];

  return (
    <div
      className="vs-settings-row mx-auto grid w-full max-w-2xl grid-cols-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      style={{ animation: "fadeUp 0.5s ease-out 0.5s both" }}
    >
      {items.map(({ icon: Icon, label, value, color }, i) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 px-2 py-4 sm:px-4 sm:py-5"
          style={{
            borderRight: i < items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : undefined,
          }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color }} strokeWidth={2} />
          <span
            className="text-[0.6rem] font-medium uppercase tracking-wide text-white/45 sm:text-xs"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {label}
          </span>
          <span className="text-sm font-bold text-white sm:text-[0.9rem]">{value}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function VersusLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchIdParam = searchParams.get("matchId");

  const { data: dashboardData } = useDashboardData();
  const localPlayer = dashboardData?.player ?? dashboardInitialState.player;

  const { status, matchId, opponent, connect, disconnect } =
    useMatchmakingSocket();

  const [countdown, setCountdown] = useState(2);
  const [redirecting, setRedirecting] = useState(false);
  const [hasStartedCountdown, setHasStartedCountdown] = useState(false);

  const matchSettings: MatchSettings = {
    rows: 10,
    cols: 10,
    bombs: 20,
    health: 3,
    turnTime: 30,
  };

  const currentMatchId = matchIdParam || matchId;

  const playerData: PlayerCardData = {
    username: localPlayer.username,
    elo: localPlayer.elo,
  };

  const opponentData: PlayerCardData = {
    username: opponent?.username ?? "ProGamer99",
    elo: opponent?.elo ?? 1230,
  };

  // Connect socket on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start countdown once socket confirms match
  useEffect(() => {
    const readyStatuses = ["matched", "joined", "game_start"];
    if (readyStatuses.includes(status) && !hasStartedCountdown) {
      setHasStartedCountdown(true);
      setCountdown(2);
    }
  }, [status, hasStartedCountdown]);

  // Countdown ticks
  useEffect(() => {
    if (!hasStartedCountdown || redirecting) return;
    if (countdown <= 0) {
      setRedirecting(true);
      router.push(currentMatchId ? `/game?matchId=${currentMatchId}` : "/game");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, hasStartedCountdown, redirecting, currentMatchId, router]);

  const handleSkip = useCallback(() => {
    setRedirecting(true);
    router.push(currentMatchId ? `/game?matchId=${currentMatchId}` : "/game");
  }, [currentMatchId, router]);

  return (
    <div className="vs-root relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      {/* Deep blue gradient background */}
      <div className="vs-bg pointer-events-none absolute inset-0 z-0" />

      {/* Main content */}
      <div className="vs-content relative z-10 flex w-full max-w-[min(100%,46rem)] flex-col items-center">
        {/* Header */}
        <header
          className="mb-6 text-center"
          style={{ animation: "fadeDown 0.45s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}
        >
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Đã tìm thấy đối thủ!
          </h1>
          <p className="text-sm font-medium text-white/50 sm:text-base">
            Chuẩn bị bước vào trận đấu
          </p>
        </header>

        {/* Arena */}
        <div
          className="vs-arena relative mb-6 flex w-full items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[rgba(5,15,30,0.65)] p-5 backdrop-blur-2xl sm:gap-4 sm:p-7"
          style={{
            boxShadow: "0 8px 48px rgba(0,20,40,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both",
          }}
        >
          {/* Left — You */}
          <div className="flex-1">
            <PlayerCard
              player={playerData}
              align="left"
              label="Bạn"
              icon={Gamepad2}
              bgFrom="#0d9488"
              bgTo="#06b6d4"
              iconColor="text-white"
            />
          </div>

          {/* Center — Countdown + VS */}
          <div className="vs-center flex flex-col items-center gap-2">
            {/* VS button — bright orange gradient */}
            <button
              type="button"
              onClick={handleSkip}
              className="vs-btn relative flex h-14 w-14 items-center justify-center rounded-full font-black text-white sm:h-16 sm:w-16"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
                boxShadow: "0 0 28px rgba(249,115,22,0.65), 0 0 10px rgba(239,68,68,0.4)",
                fontSize: "1.5rem",
                animation: "vsPulse 2.5s ease-in-out 0.8s infinite",
              }}
            >
              VS
            </button>

            {/* Countdown ring */}
            <CountdownRing count={hasStartedCountdown ? countdown : 2} />
          </div>

          {/* Right — Opponent */}
          <div className="flex-1">
            <PlayerCard
              player={opponentData}
              align="right"
              label="Đối thủ"
              icon={Swords}
              bgFrom="#dc2626"
              bgTo="#ea580c"
              iconColor="text-white"
            />
          </div>
        </div>

        {/* Settings bar */}
        <div className="mb-6 w-full px-1">
          <MatchSettingsRow settings={matchSettings} />
        </div>

        {/* Bottom start button — green */}
        <button
          type="button"
          onClick={handleSkip}
          disabled={redirecting}
          className="vs-start-btn relative flex w-full max-w-2xl items-center justify-center gap-3 overflow-hidden rounded-2xl py-4 text-base font-bold text-white sm:text-lg"
          style={{
            background: "linear-gradient(90deg, #16a34a 0%, #15803d 50%, #16a34a 100%)",
            boxShadow: "0 4px 20px rgba(22,163,74,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
            animation: "fadeUp 0.5s ease-out 0.65s both",
          }}
        >
          {/* Lightning icon */}
          <Zap className="h-5 w-5 shrink-0 text-yellow-300" strokeWidth={2.5} />
          <span>{redirecting ? "Đang bắt đầu..." : "Trận đấu sắp bắt đầu..."}</span>
        </button>
      </div>
    </div>
  );
}
