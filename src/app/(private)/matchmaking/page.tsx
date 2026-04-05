import type { Metadata } from "next";
import { MatchmakingWaitScreen } from "@/src/components/matchmaking/MatchmakingScreen";

export const metadata: Metadata = {
  title: "Đang tìm trận | Minesweeper PvP",
  description: "Trạng thái chờ ghép trận tự động",
};

export default function MatchmakingPage() {
  return <MatchmakingWaitScreen />;
}
