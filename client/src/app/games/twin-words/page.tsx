"use client";
import React from "react";
import GameLayout from "@/components/common/GameLayout";
import TwinWordsGame from "@/games/TwinWordsGame";

export default function TwinWordsPage() {
  const handleGameOver = () => {
    console.log("🎮 TwinWords Game Over! ניקוד וזמן מנוהלים ע״י GameLayout");
  };

  return (
    <GameLayout gameTitle="🧠 Twin Words">
      <TwinWordsGame onGameOver={handleGameOver} />
    </GameLayout>
  );
}
