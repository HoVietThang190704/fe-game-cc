"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  MatchFoundPayload,
  MatchJoinedPayload,
  GameStartPayload,
} from "./socket.types";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export type MatchmakingStatus =
  | "idle"
  | "connecting"
  | "searching"
  | "matched"
  | "joined"
  | "game_start"
  | "error";

interface UseMatchmakingSocketReturn {
  status: MatchmakingStatus;
  matchId: string | null;
  error: string | null;
  opponent: MatchFoundPayload["opponent"] | null;
  searchDuration: number;
  connect: () => void;
  disconnect: () => void;
}

export function useMatchmakingSocket(): UseMatchmakingSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<MatchmakingStatus>("idle");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<MatchFoundPayload["opponent"] | null>(null);
  const [searchDuration, setSearchDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setSearchDuration(0);
    timerRef.current = setInterval(() => {
      setSearchDuration((s) => s + 1);
    }, 1000);
  }, [stopTimer]);

  const disconnect = useCallback(() => {
    stopTimer();
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus("idle");
  }, [stopTimer]);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      setStatus("error");
      startTimer(); 
      return;
    }

    setError(null);
    setStatus("connecting");
    setOpponent(null);
    setMatchId(null);

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("searching");
    });

    socket.on("match_found", (payload: MatchFoundPayload) => {
      setMatchId(payload.matchId);
      setOpponent(payload.opponent ?? null);
      setStatus("matched");
    });

    socket.on("player_joined", (payload: MatchJoinedPayload) => {
      setMatchId(payload.matchId);
      setStatus("joined");
    });

    socket.on("start_game", (payload: GameStartPayload) => {
      setMatchId(payload.matchId);
      setStatus("game_start");
    });

    socket.on("player_left", () => {
      setError("Người chơi đã rời phòng.");
      setStatus("error");
      stopTimer();
    });

    socket.on("error", (err: { message?: string }) => {
      setError(err?.message ?? "Đã xảy ra lỗi không xác định.");
      setStatus("error");
      stopTimer();
    });

    socket.on("disconnect", (reason) => {
      if (
        reason !== "io client disconnect" &&
        status !== "matched" &&
        status !== "joined" &&
        status !== "game_start"
      ) {
        setError("Kết nối bị ngắt: " + reason);
        setStatus("error");
        stopTimer();
      }
    });

    socket.on("connect_error", (err: Error & { message?: string }) => {
      const raw = err?.message ?? "";
      if (/Authentication required|Invalid access token|jwt|token/i.test(raw)) {
        setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
      } else if (raw) {
        setError(`Kết nối thất bại: ${raw}`);
      } else {
        setError("Không thể kết nối server. Đảm bảo backend đang chạy (port 5000).");
      }
      setStatus("error");
    });
    // Timer bắt đầu đếm ngay khi gọi connect, không chờ WS connect
    startTimer();
  }, [startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [stopTimer]);

  return { status, matchId, error, opponent, searchDuration, connect, disconnect };
}
