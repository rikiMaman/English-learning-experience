"use client";

import React from "react";
import { useKeyboardShortcuts } from "../app/hooks/useKeyboardShortcuts";

type DialogShortcutsManagerProps = {
  onOpenHelp: () => void;
  onOpenConfirm: () => void;
  onOpenResults: () => void;
  onOpenToast: () => void;
};

export default function DialogShortcutsManager({
  onOpenHelp,
  onOpenConfirm,
  onOpenResults,
  onOpenToast,
}: DialogShortcutsManagerProps) {
  // קיצור H - עזרה
  useKeyboardShortcuts(["h", "H"], onOpenHelp);

  // קיצור C - אישור
  useKeyboardShortcuts(["c", "C"], onOpenConfirm);

  // קיצור R - תוצאות
  useKeyboardShortcuts(["r", "R"], onOpenResults);

  // קיצור T - הודעה
  useKeyboardShortcuts(["t", "T"], onOpenToast);

  return null; // לא מציגה שום דבר על המסך
}
