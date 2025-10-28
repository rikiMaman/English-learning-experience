'use client';
import React from 'react';
import GameLayout from '@/components/common/GameLayout';
import PhraseCrazeGame from '@/games/PhraseCraze';

export default function SentenceShufflePage() {
  const handleGameOver = () => {
    console.log("🎮 המשחק הסתיים! זמן והניקוד מטופלים ב-GameLayout");
  };

  return (
    <GameLayout gameTitle="🧩 PhraseCraze">
      <PhraseCrazeGame onGameOver={handleGameOver} paused={false} />
    </GameLayout>
  );
}
