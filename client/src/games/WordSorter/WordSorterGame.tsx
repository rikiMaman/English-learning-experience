

'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameProps } from "@/components/common/GameLayout";
import { getCategoryIcon } from "./categoryIcons";
import { useGameData } from "@/hooks/useGameData";
import { GameId } from "@/types";
import { useSubmitProgress } from "@/hooks/useSubmitProgress";
import { useSelector } from "react-redux";

type WordSorterRound = {
  wordText: string;
  categories: string[];
  correctIndex: number;
};

export default function WordSorterGame({ onScoreChange, onGameOver, paused,time  }: GameProps) {
  const gameId: GameId = 7;

  const { data, isLoading, isError, refetch } = useGameData(gameId);

  const [rounds, setRounds] = useState<WordSorterRound[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);
  

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  const score = useRef(0);

  const user = useSelector((state: any) => state.user.user);

  const submitProgressMutation = useSubmitProgress();

  useEffect(() => {
    correctSound.current = new Audio("/sounds/צליל הצלחה.mp3");
    wrongSound.current = new Audio("/sounds/צליל שגיאה.mp3");
  }, []);

  useEffect(() => {
    const roundData = data?.data?.data;
    if (roundData) {
      const roundsArray: WordSorterRound[] = Array(5).fill(roundData);
      setRounds(roundsArray);
    }
  }, [data]);

  if (isLoading) return <div className="text-green-600">Loading rounds...</div>;
  if (!rounds.length) return <div className="text-green-600">No rounds available.</div>;

  const round = rounds[roundIndex];
  const progress = (roundIndex / rounds.length) * 100;

  
  const handleSelect = (i: number) => {
    if (paused || completed || selectedIndex !== null) return;
  
    setSelectedIndex(i);
    const correct = i === round.correctIndex;
    setFeedback(correct ? "correct" : "wrong");
  
    if (correct) {
      score.current += 10;
      onScoreChange?.((prev) => prev + 10);
      correctSound.current?.pause();
      correctSound.current!.currentTime = 0;
      correctSound.current?.play();
    } else {
      wrongSound.current?.pause();
      wrongSound.current!.currentTime = 0;
      wrongSound.current?.play();
    }
  
    const next = roundIndex + 1;
    setTimeout(async () => {
      setFeedback(null);
      setSelectedIndex(null);
  
      if (next < rounds.length) {
        setRoundIndex(next);
        await refetch();
      } else {
        setCompleted(true);
  
        submitProgressMutation.mutate({
          gameID: gameId,
          userID: user?.userId!,
          score: score.current,
          rounds: rounds.length,
          time: timeRef.current ?? 0, 
        });
  
        onGameOver?.();
      }
    }, 1000); 
  };
  
  if (completed) {
    return (
      <div className="text-center text-green-600 font-bold text-2xl">
        🎉 All words completed!<br />Great job!
      </div>
    );
  }

  return (
    <div className="text-center relative">
      <div className="progress-bar" style={{ width: "100%", background: "#eee", height: "10px", borderRadius: "5px", marginBottom: "15px" }}>
        <div
          className="progress-bar__fill"
          style={{
            width: `${progress}%`,
            background: "#4caf50",
            height: "100%",
            borderRadius: "5px",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <h3 className="text-2xl font-semibold mb-6 text-blue-700">
        Select the correct category for the word: <span className="text-3xl font-bold text-blue">{round.wordText}</span>
      </h3>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {round.categories.map((c, i) => {
          const Icon = getCategoryIcon(c);
          let bgColor = "bg-blue-500 hover:bg-blue-600";
          if (selectedIndex !== null) {
            if (i === selectedIndex) bgColor = i === round.correctIndex ? "bg-green-500" : "bg-red-500";
            if (i === round.correctIndex && i !== selectedIndex) bgColor = "bg-green-500/70";
          }
          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={paused || selectedIndex !== null}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all ${bgColor}`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon size={24} />
              <span>{c}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className={`absolute left-1/2 transform -translate-x-1/2 top-0 text-4xl font-bold ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
          >
            {feedback === "correct" ? "✔ CORRECT!" : "❌ WRONG!"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
