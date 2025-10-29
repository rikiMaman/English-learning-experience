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
    const [winningRow, setWinningRow] = useState<number | undefined>();
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);


    const gameRef = useRef({
        board,
        currentRow,
        currentCol,
        revealingRow,
        keyboardColors,
        sounds: {} as Record<string, HTMLAudioElement>
    });


    useEffect(() => {
        gameRef.current.board = board;
        gameRef.current.currentRow = currentRow;
        gameRef.current.currentCol = currentCol;
        gameRef.current.revealingRow = revealingRow;
        gameRef.current.keyboardColors = keyboardColors;
    }, [board, currentRow, currentCol, revealingRow, keyboardColors]);


    useEffect(() => {
        gameRef.current.sounds = {
            correct: new Audio("/sounds/צליל הצלחה.mp3"),
            wrong: new Audio("/sounds/צליל שגיאה.mp3"),
            gameOver: new Audio("/audio/wrong.mp3"),
        };
    }, []);

    const updateBoard = (updateFn: (b: string[][]) => void) => {
        const newBoard = gameRef.current.board.map(r => [...r]);
        updateFn(newBoard);
        setBoard(newBoard);
    };

    const onType = useCallback((letter: string) => {
        if (paused || completed || gameRef.current.revealingRow !== -1) return;
        if (gameRef.current.currentCol >= wordLength) return;
        updateBoard(board => {
            board[gameRef.current.currentRow][gameRef.current.currentCol] = letter.toUpperCase();
        });
        setCurrentCol(gameRef.current.currentCol + 1);
    }, [paused, completed, wordLength]);

    const onDelete = useCallback(() => {
        if (paused || completed || gameRef.current.currentCol === 0 || gameRef.current.revealingRow !== -1) return;
        updateBoard(board => {
            board[gameRef.current.currentRow][gameRef.current.currentCol - 1] = "";
        });
        setCurrentCol(gameRef.current.currentCol - 1);
    }, [paused, completed]);

    const onSubmit = useCallback(() => {
        if (paused || completed || gameRef.current.revealingRow !== -1) return;
        if (gameRef.current.currentCol < wordLength) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        const guess = gameRef.current.board[gameRef.current.currentRow];
        const rowColorResult = getRowColors(guess, targetWord.toUpperCase());

        const correctCount = rowColorResult.filter(c => c === "correct").length;
        const presentCount = rowColorResult.filter(c => c === "present").length;
        const baseScore = correctCount * 4 + presentCount * 2;
        const efficiencyMultiplier = (maxGuesses - gameRef.current.currentRow) / maxGuesses;
        const roundScore = Math.round(baseScore * efficiencyMultiplier);
        onScoreChange?.(roundScore);

        setRevealingRow(gameRef.current.currentRow);
        rowColorResult.forEach((c, i) => {
            setTimeout(() => {
                setRowColors(prev => {
                    const copy = prev.map(r => [...r]);
                    copy[gameRef.current.currentRow][i] = c;
                    return copy;
                });
            }, i * 200);
        });

        setTimeout(() => {
            const newKeyboardColors = { ...gameRef.current.keyboardColors };
            guess.forEach((l, i) => {
                const c = rowColorResult[i];
                if (!newKeyboardColors[l] || c === "correct" || (c === "present" && newKeyboardColors[l] !== "correct")) {
                    newKeyboardColors[l] = c;
                }
            });
            setKeyboardColors(newKeyboardColors);

            if (guess.join("") === targetWord.toUpperCase()) {
                setWinningRow(gameRef.current.currentRow);
                gameRef.current.sounds.correct?.play().catch(e => console.warn(e));
                setTimeout(() => { setCompleted(true); onWin?.(); }, 2000);
            } else if (gameRef.current.currentRow + 1 >= maxGuesses) {
                setGameOverMessage(`Game Over! The word was: ${targetWord}`);
                gameRef.current.sounds.gameOver?.play().catch(e => console.warn(e));
                setTimeout(() => { setCompleted(true); onGameOver?.(); }, 4000);
            } else {
                gameRef.current.sounds.wrong?.play().catch(e => console.warn(e));
                setCurrentRow(gameRef.current.currentRow + 1);
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

