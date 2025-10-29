"use client";
import { useState, useEffect, useRef } from "react";
import MiniWordle from "./MiniWordle/MiniWordle";
import { GameProps } from "@/components/common/GameLayout";
import { useGameData } from "@/hooks/useGameData";
import { GameId } from "@/types";
import { useSubmitProgress } from "@/hooks/useSubmitProgress";
import { useSelector } from "react-redux";
import Button from "@/components/ui/Button";

interface MiniWordleModel {
    targetWord: string;
    wordLength: number;
    id: number | null;
}

export default function MiniWordleGame({
    onScoreChange,
    onGameOver,
    paused,
    time,
}: GameProps) {
    const gameId: GameId = 6;
    const { data, isLoading, isError, refetch } = useGameData(gameId);
    const submitProgressMutation = useSubmitProgress();
    const [miniWordleModel, setMiniWordleModel] = useState<MiniWordleModel | null>(null);
    const [loadingWord, setLoadingWord] = useState(false);
    const hasFetchedRef = useRef(false);
    const score = useRef(0);
    const round = useRef(1);
    const timeRef = useRef(time);
    const user = useSelector((state: any) => state.user.user);

    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    const setWordFromData = (wordData: any) => {
        if (!wordData) return;
        setMiniWordleModel({
            targetWord: wordData.targetWord,
            wordLength: wordData.wordLength,
            id: wordData.id ?? null,
        });
    };

    useEffect(() => {
        loadNewWord();
    }, [refetch]);

    const loadNewWord = async (resetFetched = false) => {
        try {
            setLoadingWord(true);
            if (resetFetched) hasFetchedRef.current = false;
            const { data } = await refetch();
            setWordFromData(data?.data?.data);
        } catch (err) {
            console.error("Error loading word:", err);
        } finally {
            setLoadingWord(false);
        }
    };

    const handleScoreChange = (roundScore: number) => {
        onScoreChange?.((prev) => {
            const newScore = prev + roundScore;
            score.current = newScore;
            return newScore;
        });
    };

    const handleGameOver = () => {
        onGameOver?.();
        submitProgressMutation.mutate({
            gameID: gameId,
            userID: user?.userId!,
            score: score.current,
            time: timeRef.current ?? 0,
            rounds: round.current,
        });

    };

    const handleWin = async () => {
        round.current += 1;
        await loadNewWord();
    };

    if (isLoading || loadingWord) return <p>Loading...</p>;
    if (isError) return <p>Failed to load data.</p>;
    if (!miniWordleModel) return <p>No data available.</p>;

    return (
        <>
            <Button
                onClick={() => handleGameOver()}

            >
                End Game
            </Button>

            <MiniWordle
                wordLength={miniWordleModel.wordLength}
                targetWord={miniWordleModel.targetWord}
                paused={paused}
                onScoreChange={handleScoreChange}
                onGameOver={handleGameOver}
                onWin={handleWin}
            /></>

    );
}

