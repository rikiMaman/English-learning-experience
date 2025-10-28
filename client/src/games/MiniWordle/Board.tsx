"use client";
import Tile from "@/components/ui/Tile";
import { motion } from "framer-motion";

interface BoardProps {
    board: string[][];
    rowColors: string[][];
    currentRow: number;
    shake: boolean;
    revealingRow: number;
    winningRow?: number;
}

const sanitizeColorKey = (color: string): "correct" | "present" | "absent" | "empty" | "filled" => {
    if (["correct", "present", "absent", "empty", "filled"].includes(color)) return color as any;
    return "empty";
};

export default function Board({ board, rowColors, currentRow, shake, revealingRow, winningRow }: BoardProps) {
    const getTileState = (row: number, col: number) => {
        if (row < currentRow) return rowColors[row][col];
        if (row === currentRow && board[row][col]) return "filled";
        return "empty";
    };

    return (
        <div className="flex flex-col gap-2">
            {board.map((row, rowIndex) => (
                <motion.div
                    key={rowIndex}
                    className={`flex gap-2 justify-center ${shake && rowIndex === currentRow ? "animate-shake" : ""}`}
                >
                    {row.map((letter, colIndex) => (
                        <Tile
                            key={colIndex}
                            letter={letter}
                            colorKey={sanitizeColorKey(rowColors[rowIndex][colIndex] || getTileState(rowIndex, colIndex))}
                            isRevealing={revealingRow === rowIndex}
                            revealDelay={colIndex * 0.15}
                            isWinning={winningRow === rowIndex}
                            winDelay={colIndex * 0.1}
                        />
                    ))}
                </motion.div>
            ))}

            <style jsx>{`
                @keyframes shake {
                  0%,100% { transform: translateX(0); }
                  25% { transform: translateX(-8px); }
                  75% { transform: translateX(8px); }
                }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `}</style>
        </div>
    );
}
