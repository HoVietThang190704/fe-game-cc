import type { Metadata } from "next";
import { MatchmakingScreen } from "@/src/components/matchmaking/MatchmakingScreen";

export const metadata: Metadata = {
  title: "Đang tìm đối thủ | Minesweeper PvP",
  description: "Hệ thống đang ghép bạn với người chơi cùng trình độ",
};

export default function MatchmakingPage() {
  return <MatchmakingScreen />;
}
