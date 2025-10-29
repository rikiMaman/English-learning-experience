'use client';
import React from 'react';
import GameLayout from '@/components/common/GameLayout';
import SentenceShuffleGame from '@/games/sentenceShuffle/SentenceShuffleGame';

export default function SentenceShufflePage() {

  const handleGameOver = () => {
    console.log("🎮 המשחק הסתיים! זמן והניקוד מטופלים ב-GameLayout");
  };

  return (
    <GameLayout gameTitle="🧩 Sentence Shuffle">
        <SentenceShuffleGame onGameOver={handleGameOver} />
    </GameLayout>
  );
}
