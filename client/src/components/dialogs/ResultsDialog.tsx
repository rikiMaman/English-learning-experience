"use client";

import React from "react";

type ResultsDialogProps = {
  onClose: () => void;
  results: string[];
  title?: string;
};

export default function ResultsDialog({ onClose, results, title = "Results" }: ResultsDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg max-w-md w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

        <ul className="space-y-2">
          {results.map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
