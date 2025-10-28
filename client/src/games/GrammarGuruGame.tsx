'use client';
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GameProps } from "@/components/common/GameLayout";
import Button from "@/components/ui/Button";
import { useGameData } from "@/hooks/useGameData";
import { useSubmitProgress } from "@/hooks/useSubmitProgress";
import { GameId } from "@/types";
import { GrammarGuruData } from "@/types/gamesTypes/GrammarGuru";

export default function GrammarGuruGame({ onScoreChange, onGameOver, paused, time }: GameProps) {
  const gameId: GameId = 9;
  const { data, isSuccess, isLoading, isError,refetch} = useGameData(gameId);
  const [questions, setQuestions] = useState<GrammarGuruData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score,setScore]=useState(0);
  const hasFetchedRef = useRef(false);
  const {user} = useSelector((state: any) => state.user.user);
  const submitProgressMutation = useSubmitProgress();
  const progress=((currentIndex)/questions.length)*100;

  const timeRef = useRef(time);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);
  const winSound = new Audio("/sounds/good.mp3");
  const failSound = new Audio("/sounds/bad.mp3");
  useEffect(() => {
    if (hasFetchedRef.current) return;

    if (isSuccess && data) {
      hasFetchedRef.current = true;
      const questions = data?.data.data.data || [];
      setQuestions(questions);
    }
  }, [isSuccess, data]);

  const handleSelect = (index: number) => {
    if (paused || completed || selected !== null) return;

    setSelected(index);
    const isCorrect = index === questions[currentIndex].correctIndex;
    setFeedback(isCorrect ? "✔" : "✖");
    isCorrect?winSound.play().catch(() => {}):failSound.play().catch(() => {});
    if (isCorrect) {
      onScoreChange?.((prev) => prev + 10);
      setScore(score+10);
    }
  };
const handleRestart=()=>{
    hasFetchedRef.current = false;
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setCompleted(false);
    setFeedback(null);
    refetch();
}
  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      setCompleted(true);
      onGameOver?.();
      handleRestart()
      submitProgressMutation.mutate({
        gameID: gameId,
        userID: user?.userId!,
        score: score,
        time: timeRef.current ?? 0,
        rounds: questions.length,
      });
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading questions...</p>;
  if (isError) return <p className="text-red-500">Error loading game data.</p>;
  if (!isSuccess || !questions.length) return <p className="text-gray-500">No questions loaded yet...</p>;
  if (completed) return <p className="text-xl font-semibold text-green-600">All questions completed!</p>;

  return (
    
    <div className="text-center">
     <div
        className="progress-bar"
        style={{
          width: "100%",
          background: "#eee",
          height: "10px",
          borderRadius: "5px",
          marginBottom: "15px",
        }}
      >
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
      <h3 className="text-xl font-semibold mb-4 text-blue-400">
        Question {currentIndex + 1} of {questions.length}
      </h3>

      <div className="mb-4 flex flex-col gap-2">
        {questions[currentIndex].sentences.map((sentence, i) => {
          const isCorrect = i === questions[currentIndex].correctIndex;
          const isSelected = i === selected;
          const inlineBg =
            selected === null
              ? undefined
              : isCorrect
              ? "#10B981"
              : isSelected
              ? "#EF4444"
              : "#9CA3AF";
          const classWhenNoSelection = "bg-blue-500 hover:bg-blue-600";
          const classWhenSelected = isCorrect ? "bg-green-500" : isSelected ? "bg-red-500" : "bg-gray-400";

          const computedClass =
            selected === null
              ? `btn w-full px-4 py-2 rounded-lg text-white transition-all ${classWhenNoSelection}`
              : `btn w-full px-4 py-2 rounded-lg text-white transition-all ${classWhenSelected}`;

          const isDisabled = paused || selected !== null;

          return (
            <div key={i} className="relative">
              <Button
                onClick={() => handleSelect(i)}
                disabled={isDisabled}
                className={computedClass}
                style={inlineBg ? { backgroundColor: inlineBg } : undefined}
              >
                {sentence}
              </Button>

              {selected !== null && (
                <>
                  {isSelected && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                      {feedback}
                    </span>
                  )}
                  {isCorrect && !isSelected && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-green-700">
                      ✔
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selected !== null && (
        <Button
          onClick={handleNext}
          className= "bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Next
        </Button>
      )}
    </div>
  );
}
