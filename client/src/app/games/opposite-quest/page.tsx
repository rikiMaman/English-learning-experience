'use client';

import React from 'react';
import GameLayout from '@/components/common/GameLayout';
import OppositeQuestGame from '@/games/OppositeQuestGame';

export default function OppositeQuestPage() {

  const handleGameOver = () => {
    console.log("🎮 The game is over! Time and score are handled in GameLayout");
  };

  return (
    <GameLayout gameTitle="🕵️‍♂️ Opposite Quest">
   <OppositeQuestGame onGameOver={handleGameOver} />
   </GameLayout>
  );
}
