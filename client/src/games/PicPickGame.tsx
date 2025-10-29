"use client";
import { useState, useEffect, useRef } from "react";
import { GameProps } from "@/components/common/GameLayout";
import { useGameData } from "@/hooks/useGameData";
import { useSubmitProgress } from "@/hooks/useSubmitProgress";
import { GameId } from "@/types";
import { PicPickItem } from "@/types/gamesTypes/PicPick";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function PicPickGame({ onScoreChange, onGameOver, paused, time }: GameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const round = useRef(0);
    const [questions, setQuestions] = useState<PicPickItem[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const correctSound = useRef<HTMLAudioElement | null>(null);
    const wrongSound = useRef<HTMLAudioElement | null>(null);

    const gameId: GameId = 17;
    const user = useSelector((state: any) => state.user.user);
    const { data, isLoading, isError, refetch } = useGameData(gameId);
    const hasFetchedRef = useRef(false);
    const baseUrl = "https://english-platform-testpnoren.s3.us-east-1.amazonaws.com/";

    useEffect(() => {
        const items: PicPickItem[] = data?.data?.data?.items || [];
        if (!items.length || hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        setQuestions(items);
    }, [data]);

    useEffect(() => {
        correctSound.current = new Audio("/sounds/צליל הצלחה.mp3");
        wrongSound.current = new Audio("/sounds/צליל שגיאה.mp3");
    }, []);

    const submitProgress = useSubmitProgress();

    const timeRef = useRef(time);
    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    if (isLoading || !questions.length) return <p>Loading...</p>;
    if (isError || !data) return <p>No data available.</p>;

    const currentItem = questions[currentIndex];

    const handleFinish = async () => {
        await submitProgress.mutateAsync({
            gameID: gameId,
            userID: user?.userId!,
            score: score,
            time: timeRef.current ?? 0,
            rounds: round.current,
        });
        hasFetchedRef.current = false;
        setCurrentIndex(0);
        setCompleted(false);
        setScore(0);
        setQuestions([]);
        refetch();
    }

    const handleAnswer = (index: number) => {
        if (paused || completed || !currentItem || selectedIndex !== null) return;

        setSelectedIndex(index);
        const correct = index === currentItem.correctIndex;
        setIsCorrect(correct);

        if (correct) {
            if (correctSound.current) {
                correctSound.current.pause();
                correctSound.current.currentTime = 0;
                correctSound.current.play();
            }
            round.current += 1;
            setScore(score + 10);
            onScoreChange?.((prev) => prev + 10);
        }
        else{
            if (wrongSound.current) {
                wrongSound.current.pause();
                wrongSound.current.currentTime = 0;
                wrongSound.current.play();
            }
        }

        setTimeout(() => {
            setSelectedIndex(null);
            setIsCorrect(null);

            const nextIndex = currentIndex + 1;
            if (nextIndex < questions.length) {
                setCurrentIndex(nextIndex);
            } else {
                setCompleted(true);
                onGameOver?.();
                handleFinish();
            }
        }, 600);
    };

    if (completed) {
        return <p className="sentence-game__completed">כל התמונות הושלמו! 👏!</p>;
    }
    const progress = ((currentIndex) / questions.length) * 100;
    return (
        <div className="sentence-game">
           
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

                <h3 className="sentence-game__title">
                    Picture {currentIndex + 1} of {questions.length}
                </h3>
                <div className="picpick__image_container">
                    <motion.img
                        key={currentItem.imageUrl}
                        src={baseUrl + currentItem.imageUrl}
                        alt="Game Image"
                        className="picpick__image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                    />
                </div>
                <div className="picpick__grid">
                    {currentItem.sentences.map((s, i) => (
                        <motion.button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            disabled={paused}
                            className={`btn-primary picpick__option ${selectedIndex === i ? (isCorrect ? "correct" : "wrong") : ""}`}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                            {s}
                        </motion.button>
                    ))}
                </div>
            </div>
            );
}
