"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Board from "./Board";
import Keyboard from "@/components/ui/Keyboard";

interface MiniWordleProps {
    wordLength: number;
    targetWord: string;
    maxGuesses?: number;
    paused?: boolean;
    onScoreChange?: (roundScore: number) => void;
    onGameOver?: () => void;
    onWin?: () => void;
}

const getRowColors = (guess: string[], solution: string) => {
    const colors = Array(guess.length).fill("absent");
    const solutionLetters = solution.toUpperCase().split("");

    guess.forEach((l, i) => {
        if (solutionLetters[i] === l) {
            colors[i] = "correct";
            solutionLetters[i] = "";
        }
    });

    guess.forEach((l, i) => {
        if (colors[i] !== "correct") {
            const idx = solutionLetters.indexOf(l);
            if (idx !== -1) {
                colors[i] = "present";
                solutionLetters[idx] = "";
            }
        }
    });

    return colors;
};

export default function MiniWordle({
    wordLength,
    targetWord,
    maxGuesses = 6,
    paused = false,
    onScoreChange,
    onGameOver,
    onWin
}: MiniWordleProps) {
    const [board, setBoard] = useState(Array.from({ length: maxGuesses }, () => Array(wordLength).fill("")));
    const [rowColors, setRowColors] = useState(Array.from({ length: maxGuesses }, () => Array(wordLength).fill("empty")));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [shake, setShake] = useState(false);
    const [revealingRow, setRevealingRow] = useState(-1);
    const [completed, setCompleted] = useState(false);
    const [keyboardColors, setKeyboardColors] = useState<Record<string, string>>({});
    const [winningRow, setWinningRow] = useState<number | undefined>(undefined);
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

    const correctSound = useRef<HTMLAudioElement | null>(null);
    const wrongSound = useRef<HTMLAudioElement | null>(null);
    const gameOverSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        correctSound.current = new Audio("/sounds/צליל הצלחה.mp3");
        wrongSound.current = new Audio("/sounds/צליל שגיאה.mp3");
        gameOverSound.current = new Audio("/audio/wrong.mp3");
    }, []);

    const boardRef = useRef(board);
    const currentRowRef = useRef(currentRow);
    const currentColRef = useRef(currentCol);
    const revealingRowRef = useRef(revealingRow);
    const keyboardColorsRef = useRef(keyboardColors);

    useEffect(() => { boardRef.current = board; }, [board]);
    useEffect(() => { currentRowRef.current = currentRow; }, [currentRow]);
    useEffect(() => { currentColRef.current = currentCol; }, [currentCol]);
    useEffect(() => { revealingRowRef.current = revealingRow; }, [revealingRow]);
    useEffect(() => { keyboardColorsRef.current = keyboardColors; }, [keyboardColors]);

    const onType = useCallback((letter: string) => {
        if (paused || completed || revealingRowRef.current !== -1) return;
        if (currentColRef.current >= wordLength) return;

        const newBoard = boardRef.current.map(r => [...r]);
        newBoard[currentRowRef.current][currentColRef.current] = letter.toUpperCase();
        setBoard(newBoard);
        setCurrentCol(currentColRef.current + 1);
    }, [paused, completed, wordLength]);

    const onDelete = useCallback(() => {
        if (paused || completed || currentColRef.current === 0 || revealingRowRef.current !== -1) return;

        const newBoard = boardRef.current.map(r => [...r]);
        newBoard[currentRowRef.current][currentColRef.current - 1] = "";
        setBoard(newBoard);
        setCurrentCol(currentColRef.current - 1);
    }, [paused, completed]);

    const onSubmit = useCallback(() => {
        if (paused || completed || revealingRowRef.current !== -1) return;
        if (currentColRef.current < wordLength) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        const guess = boardRef.current[currentRowRef.current];
        const rowColorResult = getRowColors(guess, targetWord.toUpperCase());


        let correctCount = rowColorResult.filter(c => c === "correct").length;
        let presentCount = rowColorResult.filter(c => c === "present").length;

        let baseScore = correctCount * 4 + presentCount * 2;
        let efficiencyMultiplier = (maxGuesses - currentRowRef.current) / maxGuesses;

        let roundScore = Math.round(baseScore * efficiencyMultiplier);
        onScoreChange?.(roundScore);



        setRevealingRow(currentRowRef.current);
        rowColorResult.forEach((c, i) => {
            setTimeout(() => {
                setRowColors(prev => {
                    const copy = prev.map(r => [...r]);
                    copy[currentRowRef.current][i] = c;
                    return copy;
                });
            }, i * 200);
        });

        setTimeout(() => {
            const newKeyboardColors = { ...keyboardColorsRef.current };
            guess.forEach((l, i) => {
                const c = rowColorResult[i];
                if (!newKeyboardColors[l] || c === "correct" || (c === "present" && newKeyboardColors[l] !== "correct")) {
                    newKeyboardColors[l] = c;
                }
            });
            setKeyboardColors(newKeyboardColors);

            if (guess.join("") === targetWord.toUpperCase()) {
                setWinningRow(currentRowRef.current);
                correctSound.current?.play().catch(e => console.warn("Audio play failed:", e));

                setTimeout(() => {
                    setCompleted(true);
                    onWin?.();
                }, 2000);
            } else if (currentRowRef.current + 1 >= maxGuesses) {
                setGameOverMessage(`Game Over! The word was: ${targetWord}`);
                gameOverSound.current?.play().catch(e => console.warn("Audio play failed:", e));
                setTimeout(() => {
                    setCompleted(true);
                    onGameOver?.();
                }, 4000);
            } else {
                wrongSound.current?.play().catch(e => console.warn("Audio play failed:", e));

                setCurrentRow(currentRowRef.current + 1);
                setCurrentCol(0);
            }

            setRevealingRow(-1);
        }, wordLength * 220 + 300);
    }, [paused, completed, wordLength, onScoreChange, onGameOver, onWin, targetWord, maxGuesses]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (key === "ENTER") onSubmit();
            else if (key === "BACKSPACE") onDelete();
            else if (/^[A-Z]$/.test(key)) onType(key);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onType, onDelete, onSubmit]);

    return (
        <div className="flex flex-col items-center mt-6 relative">
            <p className="text-lg font-medium mb-2">
                Guess {currentRow + 1} of {maxGuesses}
            </p>

            <Board
                board={board}
                rowColors={rowColors}
                currentRow={currentRow}
                shake={shake}
                revealingRow={revealingRow}
                winningRow={winningRow}
            />

            <AnimatePresence>
                {gameOverMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-red-500 text-white px-6 py-3 rounded shadow-lg font-bold mt-4"
                    >
                        {gameOverMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <Keyboard
                onType={onType}
                onDelete={onDelete}
                onSubmit={onSubmit}
                keyboardColors={keyboardColors}
                disabled={paused || completed || revealingRow !== -1}
            />
        </div>
    );
}
