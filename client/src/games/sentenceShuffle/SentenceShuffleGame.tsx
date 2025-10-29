"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDragAndDrop, DraggableItem } from "@/hooks/useDragAndDrop";
import { useGameData } from "@/hooks/useGameData";
import { useSubmitProgress } from "@/hooks/useSubmitProgress";
import { useSelector } from "react-redux";
import { GameProps } from "@/components/common/GameLayout";
import { GameId } from "@/types";
import { SentenceShuffleItem } from "@/types/gamesTypes/SentenceShuffle";
import { SentenceSlots, WordBank, GameButtons, FeedbackMessage } from "./index";

const generateId = () => Math.floor(Math.random() * 1000000).toString();

export default function SentenceShuffleGame({
  onScoreChange,
  onGameOver,
  paused,
  score,
  time,
}: GameProps) {
  const gameId: GameId = 4;
  const { data, isLoading, isSuccess, isError, refetch } = useGameData(gameId);
  const submitProgressMutation = useSubmitProgress();
  const user = useSelector((state: any) => state.user.user);

  const [rounds, setRounds] = useState<SentenceShuffleItem[]>([]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const roundStartRef = useRef<number | null>(null);

  const currentRound = rounds[index];

  const initialWords = useMemo(() => {
    if (!currentRound?.words) return [];
    return currentRound.words.map((w) => ({ id: generateId(), value: w }));
  }, [currentRound]);

  const {
    availableItems,
    selectedSlots,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleItemSelect,
    handleDeselectItem,
  } = useDragAndDrop<DraggableItem>(
    initialWords,
    currentRound?.words?.length ?? 0,
    paused || status !== "idle",
    status
  );

  const currentGuess = selectedSlots
    .filter(Boolean)
    .map((s) => s!.value)
    .join(" ");
  const isSubmitDisabled =
    paused || selectedSlots.some((s) => s === null) || status !== "idle";

  useEffect(() => {
    if (currentRound) roundStartRef.current = Date.now();
  }, [index, currentRound]);

  const computeRoundScore = (
    elapsedMs: number,
    correctPositions: number,
    correctTotal: number
  ) => {
    const basePerWord = 10;
    const accuracyPoints = correctPositions * basePerWord;
    const maxTimeBonus = 5;
    const idealMs = 5000;
    const timeFactor = Math.max(
      0,
      (idealMs - Math.min(elapsedMs, idealMs)) / idealMs
    );
    const timeBonus = Math.round(maxTimeBonus * timeFactor);
    const fullBonus = correctPositions === correctTotal ? 10 : 0;
    return accuracyPoints + timeBonus + fullBonus;
  };

  const handleCheck = () => {
    if (isSubmitDisabled) return;

    const correctWords = currentRound.correctSentence.split(" ");
    const guessWords = currentGuess.split(" ");
    const correctPositions = guessWords.filter(
      (w, i) => w === correctWords[i]
    ).length;
    const isCorrect = currentGuess === currentRound.correctSentence;

    const elapsed = roundStartRef.current
      ? Date.now() - roundStartRef.current
      : 0;
    const roundScore = computeRoundScore(
      elapsed,
      correctPositions,
      correctWords.length
    );
    onScoreChange?.((prev) => prev + roundScore);

    setStatus(isCorrect ? "success" : "error");
    setFeedback(
      isCorrect
        ? `Perfect! +${roundScore} pts`
        : `${correctPositions} words in correct position. +${roundScore} pts`
    );

    if (index + 1 >= rounds.length) {
      setGameFinished(true);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setStatus("idle");

    if (index + 1 < rounds.length) {
      setIndex((i) => i + 1);
    }
  };

  useEffect(() => {
    if (!gameFinished) return;

    const timer = setTimeout(async () => {
      submitProgressMutation.mutate({
        gameID: gameId,
        userID: user?.userId!,
        score: score!,
        time: typeof time === "number" ? time : 0,
        rounds: index + 1,
      });
      onGameOver?.();
    }, 2000); 
    return () => clearTimeout(timer);
  }, [gameFinished]);

  useEffect(() => {
    loadNewRounds();
  }, []);

  const loadNewRounds = async () => {
    setIsReloading(true);
    try {
      const newData = await refetch();
      const newRounds = newData?.data?.data?.data.rounds || [];
      if (newRounds.length) {
        setRounds(newRounds);
        setIndex(0);
        setGameFinished(false);
      }
    } finally {
      setIsReloading(false);
    }
  };

  if (isLoading || isReloading)
    return <p className="text-center mt-10">Loading...</p>;
  if (isError || rounds.length === 0)
    return <p className="text-center mt-10">No rounds available.</p>;

  return (
    <div className="text-center max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-xl">
      <h3 className="text-xl font-semibold mb-6 text-slate-900">
        Round {index + 1} of {rounds.length}
      </h3>

      <SentenceSlots
        status={status}
        selectedSlots={selectedSlots}
        handleDrop={handleDrop}
        handleDeselectItem={handleDeselectItem}
      />

      <WordBank
        availableItems={availableItems}
        draggedItem={draggedItem}
        handleItemSelect={handleItemSelect}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        paused={paused}
      />

      <p className="mb-3 text-lg text-slate-900">
        Your sentence: <strong>{currentGuess}</strong>
      </p>

      <FeedbackMessage feedback={feedback} status={status} />

      <GameButtons
        status={status}
        isSubmitDisabled={isSubmitDisabled}
        handleCheck={handleCheck}
        handleNext={handleNext}
      />
    </div>
  );
}
