"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MineSetupPhase } from "@/src/components/game/MineSetupPhase";
import { GamePlayPhase } from "@/src/components/game/GamePlayPhase";
import { useGameSetup, useGameBoard } from "@/src/lib/hooks/useGameBoard";
import { createEmptyBoard, placeMines } from "@/src/lib/game/game.utils";

export default function GamePage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<"setup" | "playing" | "finished">("setup");
  const [currentPlayer, setCurrentPlayer] = useState<"you" | "opponent">("you");
  const [winner, setWinner] = useState<"you" | "opponent" | null>(null);
  const [winnerEloDelta, setWinnerEloDelta] = useState(20);
  const [loserEloDelta, setLoserEloDelta] = useState(-10);

  const { setupState, toggleCell, clearSelection, completeSetup } =
    useGameSetup(20);

  const yourBoard = useGameBoard(20);

  const opponentBoard = useGameBoard(20);

  const [stats, setStats] = useState({
    playerHits: 0,
    playerMisses: 0,
    opponentHits: 0,
    opponentMisses: 0,
  });

  const handleSetupComplete = useCallback(() => {
    completeSetup();

    yourBoard.placeMinesOnBoard(Array.from(setupState.selectedCells));

    const randomCells = new Set<string>();
    while (randomCells.size < 20) {
      const randomId = `${Math.floor(Math.random() * 10)}-${Math.floor(
        Math.random() * 10
      )}`;
      randomCells.add(randomId);
    }
    opponentBoard.placeMinesOnBoard(Array.from(randomCells));

    setGamePhase("playing");
  }, [completeSetup, setupState.selectedCells, yourBoard, opponentBoard]);

  const handleOpponentCellClick = useCallback(
    (cellId: string) => {
      if (currentPlayer !== "you") return;

      opponentBoard.reveal(cellId);

      const [row, col] = cellId.split("-").map(Number);
      const cell = opponentBoard.board.cells[row][col];

      if (cell.state === "hit") {
        setStats((prev) => {
          const newStats = {
            ...prev,
            playerHits: prev.playerHits + 1,
          };
          if (newStats.playerHits >= 20) {
             setWinner("you");
             setGamePhase("finished");
          }
          return newStats;
        });
      } else {
        setStats((prev) => ({
          ...prev,
          playerMisses: prev.playerMisses + 1,
        }));
        setCurrentPlayer("opponent");
      }
    },
    [currentPlayer, opponentBoard]
  );

  const handleOpponentCellRightClick = useCallback(
    (cellId: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (currentPlayer !== "you") return;
      opponentBoard.flag(cellId);
    },
    [currentPlayer, opponentBoard]
  );

  const handlePowerUse = useCallback(
    (boardSide: "left" | "right", powerIndex: 1 | 2 | 3) => {
      console.log(`Power ${powerIndex} used on ${boardSide} board`);
    },
    []
  );


  const handleReset = useCallback(() => {
    setGamePhase("setup");
    setCurrentPlayer("you");
    setWinner(null);
    setWinnerEloDelta(20);
    setLoserEloDelta(-10);
    yourBoard.reset();
    opponentBoard.reset();
    setStats({
      playerHits: 0,
      playerMisses: 0,
      opponentHits: 0,
      opponentMisses: 0,
    });
  }, [yourBoard, opponentBoard])

  useEffect(() => {
    if (gamePhase !== "finished") return;


  }, [gamePhase, router]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,_rgba(5,209,255,0.16),_rgba(8,30,54,0.92)_60%)] text-sky-200 p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        {gamePhase === "setup" ? (
          <MineSetupPhase
            board={yourBoard.board}
            setupState={setupState}
            onCellClick={toggleCell}
            onClearSelection={clearSelection}
            onConfirm={handleSetupComplete}
          />
        ) : gamePhase === "playing" ? (
          <GamePlayPhase
            playerBoard={yourBoard.board}
            opponentBoard={opponentBoard.board}
            currentPlayer={currentPlayer}
            onCellClick={handleOpponentCellClick}
            onCellRightClick={handleOpponentCellRightClick}
            onReset={handleReset}
            stats={stats}
            playerData={{
              username: "You",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
              elo: 1250,
              winRate: 58,
            }}
            opponentData={{
              username: "Opponent",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=opponent",
              elo: 1200,
              winRate: 55,
            }}
            onPowerUse={handlePowerUse}
          />
        ) : gamePhase === "finished" ? (
          <section className="mx-auto max-w-2xl mt-12 rounded-2xl border border-sky-400/30 bg-slate-900/60 p-10 text-center shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-lg">
            <h2 className="text-3xl font-black tracking-widest text-cyan-200 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              TRẬN ĐÃ KẾT THÚC
            </h2>
            <p className="mt-4 text-sky-100/90 text-xl font-medium">
              {winner === "you"
                ? "Bạn đã chiến thắng! 🔥"
                : "Bạn đã thua. Thử lại ván mới nào! 🛡️"}
            </p>
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-sky-400/20 bg-slate-950/80 p-6 text-left shadow-inner">
              <p className="text-sm font-bold uppercase tracking-widest text-sky-300">
                Kết quả ELO
              </p>
              <div className="mt-5 flex flex-col gap-4 font-mono text-lg">
                <div className="flex justify-between items-center rounded-lg bg-emerald-500/10 px-4 py-3 border border-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <span>Người thắng:</span>
                  <span className="font-bold text-emerald-400">+{winnerEloDelta} ELO</span>
                </div>
                <div className="flex justify-between items-center rounded-lg bg-rose-500/10 px-4 py-3 border border-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                  <span>Người thua:</span>
                  <span className="font-bold text-rose-400">{loserEloDelta} ELO</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex justify-center gap-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl border border-sky-300/30 bg-slate-800/80 px-8 py-3.5 font-bold uppercase tracking-widest text-sky-200 transition-all hover:bg-slate-700/80 hover:text-white active:scale-95"
              >
                Về Dashboard
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 px-8 py-3.5 font-bold uppercase tracking-widest text-cyan-200 transition-all hover:border-cyan-300 hover:from-cyan-500/40 hover:to-blue-500/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-95"
              >
                Chơi lại
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
