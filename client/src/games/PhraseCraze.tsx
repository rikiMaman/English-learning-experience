"use client";

import { useEffect, useState, useRef } from "react";
import { GameProps } from "@/components/common/GameLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useGameData } from "@/hooks/useGameData";
import { useSubmitProgress } from "@/hooks/useSubmitProgress";
import { useSelector } from "react-redux";

type PhraseItem = {
  phrase: string;
  options: string[];
  correctIndex: number;
  FullPhrase?: string;
  meaning?: string;
};

const fallbackPhrases: PhraseItem[] = [
  {
    phrase: "A blessing in ___",
    options: ["disguise", "heaven", "time", "faith"],
    correctIndex: 0,
    meaning: "Something good that is not recognized at first.",
  },
  {
    phrase: "Break the ___",
    options: ["ice", "stone", "silence", "wall"],
    correctIndex: 0,
    meaning: "To initiate social interactions in a new or awkward situation.",
  },
];

export default function PhraseCrazeGame({ onScoreChange, onGameOver, paused }: GameProps) {
  const gameId = 16;

  const [phrases, setPhrases] = useState<PhraseItem[]>(fallbackPhrases);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [gameStartTime, setGameStartTime] = useState(Date.now());

  const user = useSelector((state: any) => state.user.user);
  const { data, isLoading, isError, refetch } = useGameData(gameId, { enabled: false });
  const submitProgressMutation = useSubmitProgress();

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/צליל הצלחה.mp3");
    wrongSound.current = new Audio("/sounds/צליל שגיאה.mp3");
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  useEffect(() => {
    if (!data) return;
    let serverPhrases: any[] = [];
    if (Array.isArray(data.phrases)) serverPhrases = data.phrases;
    else if (Array.isArray(data.data?.phrases)) serverPhrases = data.data.phrases;
    else if (Array.isArray(data.data?.data?.phrases)) serverPhrases = data.data.data.phrases;

    if (serverPhrases.length > 0) {
      const mapped = serverPhrases.map((item: any) => item.data || item);
      setPhrases(mapped);
    }
  }, [data]);

  const currentPhrase = phrases[currentIndex];
  const totalPhrases = phrases.length;
  const progress = ((currentIndex) / totalPhrases) * 100;

  const submitGameProgress = async () => {
    if (!user?.userId) return;

    await submitProgressMutation.mutateAsync({
      gameID: gameId,
      userID: user.userId,
      score: score,
      time: Math.floor((Date.now() - gameStartTime) / 1000), 
      rounds: currentIndex + 1,
    });

    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleSelect = (index: number) => {
    if (paused || showAnswer) return;

    setSelected(index);
    setShowAnswer(true);
    const correct = index === currentPhrase.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      if (correctSound.current) { correctSound.current.pause(); correctSound.current.currentTime = 0; correctSound.current.play(); }
      let points = 10;
      const elapsedSeconds = (Date.now() - gameStartTime) / 1000; 
      if (elapsedSeconds <= 3) points += 5;
      else if (elapsedSeconds <= 6) points += 3;

      setScore((prev) => prev + points);
      onScoreChange?.((prev) => prev + points);
    } else {
      if (wrongSound.current) { wrongSound.current.pause(); wrongSound.current.currentTime = 0; wrongSound.current.play(); }
    }

    setTimeout(() => {
      if (currentIndex + 1 < phrases.length) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
        setShowAnswer(false);
      } else {
        setCompleted(true);
        onGameOver?.();
        submitGameProgress(); 
      }
    }, 3000);
  };

  let content;
  if (isLoading) {
    content = <p className="text-center text-gray-400">Loading phrases...</p>;
  } else if (isError) {
    content = <p className="text-center text-red-400">Error loading data</p>;
  } else if (completed) {
    content = (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-center text-2xl font-semibold">כל הביטויים הושלמו! 👏</p>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="progress-bar w-full max-w-md mb-4" style={{ background: "#333", height: "10px", borderRadius: "5px" }}>
          <div style={{ width: `${progress}%`, background: "#4caf50", height: "100%", borderRadius: "5px", transition: "width 0.4s ease" }} />
        </div>
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }}
              exit={{ opacity: 0, y: -50 }}
              className="flex flex-col items-center gap-6"
            >
              <h3 className="text-lg font-bold text-center">Complete the idiom:</h3>
              <p className="text-xl font-medium text-center">{currentPhrase.phrase}</p>
              <div className="flex flex-col gap-3 w-full">
                {currentPhrase.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={paused || showAnswer}
                    className={`btn-primary w-full ${
                      showAnswer
                        ? i === currentPhrase.correctIndex
                          ? "btn-primary--correct"
                          : i === selected
                          ? "btn-primary--wrong"
                          : ""
                        : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showAnswer && (
                <motion.div className="p-4 w-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
                  <p className={`text-2xl font-bold mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {isCorrect ? "Correct! Well done!" : "Wrong! Try again next time!"}
                  </p>
                  <p className="mb-1 text-lg">
                    Full phrase: <strong>{currentPhrase.phrase.replace("___", currentPhrase.options[currentPhrase.correctIndex])}</strong>
                  </p>
                  <p className="text-gray-300">{currentPhrase.meaning}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return content;
}
