import React from "react";

interface GameButtonsProps {
  status: "idle" | "success" | "error";
  isSubmitDisabled: boolean;
  handleCheck: () => void;
  handleNext: () => void;
}

export default function GameButtons({
  status,
  isSubmitDisabled,
  handleCheck,
  handleNext,
}: GameButtonsProps) {
  const buttonClass =
    status === "success"
      ? "bg-green-600 hover:bg-green-700"
      : status === "error"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="space-y-3 mt-4">
      {status === "idle" && (
        <button
          className={`w-full py-3 rounded-lg text-white font-bold transition-colors duration-300 ${buttonClass}`}
          disabled={isSubmitDisabled}
          onClick={handleCheck}
        >
          Check
        </button>
      )}

      {(status === "success" || status === "error") && (
        <button
          className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          onClick={handleNext}
        >
          Next Round
        </button>
      )}
    </div>
  );
}
