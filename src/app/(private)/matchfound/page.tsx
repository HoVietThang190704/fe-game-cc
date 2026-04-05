import type { Metadata } from "next";
import { VersusLayout } from "@/src/components/matchfound/VersusLayout";

export const metadata: Metadata = {
  title: "Trận đấu đã tìm thấy! | Minesweeper PvP",
  description: "Xem thông tin trận đấu và chuẩn bị chiến đấu",
};

export default function MatchFoundPage() {
  return <VersusLayout />;
}
