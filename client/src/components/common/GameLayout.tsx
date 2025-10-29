"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import useGameState from "@/hooks/useGameState";
import ScoreDisplay from "../leaderboard/ScoreDisplay";
import GameOverModal from "../leaderboard/GameOverModal";
import HelpScreen from "../leaderboard/HelpScreen";
import useGameTimer from "@/hooks/useGameTimer";
import Countdown3_2_1 from "../hud/countdown3_2_1";
import AudioToggle from "../hud/audioToggle";

import { Game } from "@/types";
import WelcomeScreen from "../leaderboard/WelcomeScreen";

export type GameProps = {
  onScoreChange?: (value: number | ((prev: number) => number)) => void;
  onGameOver?: () => void;
  paused?: boolean;
  time?: number;
  score?: number;
  setScore?: React.Dispatch<React.SetStateAction<number>>;
};

type GameLayoutProps = {
  children: React.ReactNode;
  gameTitle: string;
};

export default function GameLayout({ children, gameTitle }: GameLayoutProps) {
  const { stage, goToStage, nextStage, resetGame } = useGameState("welcome");
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { time, start, stop, reset } = useGameTimer(0);
  const [paused, setPaused] = React.useState(false);
  const [countdownActive, setCountdownActive] = React.useState(false);

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const gameNameFromUrl = pathname?.split("/").pop()?.toLowerCase() ?? "";


  const gameData = useMemo(() => {
    const allData: Game[] = queryClient
      .getQueriesData<Game>({})
      .map(([_, data]) => data)
      .filter(Boolean)
      .flat() as Game[];

    return allData.find((data) => {
      const normalizedName = data.gameName.toLowerCase().replace(/\s+/g, "-");
      return normalizedName === gameNameFromUrl;
    });
  }, [queryClient, gameNameFromUrl]);

  useEffect(() => {
    const savedTotal = localStorage.getItem("totalScore");
    if (savedTotal) setTotalScore(Number(savedTotal));
  }, []);

  useEffect(() => {
    if (stage === "game" && !gameOver && !paused) start();
    else stop();
  }, [stage, gameOver, paused]);

  const handleGameOver = () => {
    stop();
    setGameOver(true);
    goToStage("end");
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    reset();
    resetGame();
    
  };

  const handleScoreChange = (value: number | ((prev: number) => number)) => {
    setScore((prev) => {
      const newScore = typeof value === "function" ? value(prev) : value;
      setTotalScore((prevTotal) => {
        const newTotal = prevTotal + (newScore - prev);
        localStorage.setItem("totalScore", String(newTotal));
        return newTotal;
      });
      return newScore;
    });
  };

  const handleResume = () => setCountdownActive(true);

  return (
    <div className="game-layout">
      <h1 className="game-layout__title">{gameTitle}</h1>

      {/* Welcome */}
      {stage === "welcome" && (
        <WelcomeScreen
          onStart={nextStage}
          description={gameData?.description}
        />
      )}

      {/* Help */}
      {stage === "help" && (
        <HelpScreen
          onContinue={() => goToStage("game")}
          instructions={gameData?.instructions}
        />
      )}

      {/* Game */}
      {stage === "game" && (
        <div className="game-layout__container">
          {(paused || countdownActive) && (
            <div className="game-overlay">
              {paused && !countdownActive && (
                <button onClick={handleResume} className="btn-secondary">
                  ▶ Resume
                </button>
              )}
              {countdownActive && (
                <Countdown3_2_1
                  onFinish={() => {
                    setCountdownActive(false);
                    setPaused(false);
                  }}
                />
              )}
            </div>
          )}

          <div
            className={`game-hud ${paused || countdownActive ? "disabled" : ""
              }`}
          >
            <div className="hud-timer">
              {Math.floor(time / 60)}:
              {time % 60 < 10 ? "0" + (time % 60) : time % 60}
            </div>
            <ScoreDisplay score={score} />
            <AudioToggle />
            <button
              onClick={() => setPaused(true)}
              className="btn-secondary"
              disabled={paused || countdownActive}
            >
              ⏸ Pause
            </button>
          </div>

          <div className="game-content">
            {React.isValidElement(children) &&
              React.cloneElement(children as React.ReactElement<GameProps>, {
                onScoreChange: handleScoreChange,
                onGameOver: handleGameOver,
                paused: paused || countdownActive,
                time,
                score,
                setScore,
              })}
          </div>
        </div>
      )}

      {/* End */}
      {stage === "end" && gameOver && (
        <GameOverModal score={score} time={time} onRestart={handleRestart} />
      )}
    </div>
  );
}
