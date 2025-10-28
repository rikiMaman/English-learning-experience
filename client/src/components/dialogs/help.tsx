"use client";

import React from "react";

type HelpDialogProps = {
  onClose: () => void;
  text: string;
  title?: string;
};

export default function HelpDialog({ onClose, text, title = "Help" }: HelpDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* רקע צבעוני עם blur ו-gradient עדין */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-purple-400/30 to-indigo-500/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* תוכן הדיאלוג */}
      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-[0_8px_30px_rgba(99,102,241,0.25)] max-w-md w-full p-6 mx-4 border border-gray-100 dark:border-gray-700 animate-[fadeIn_0.25s_ease-in-out]">
        {/* כפתור X */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xl leading-none font-bold transition-colors"
          aria-label="Close help dialog"
        >
          ×
        </button>

        {/* כותרת */}
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h2>

        {/* טקסט עזרה */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  );
}
