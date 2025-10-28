'use client';
import React, { useState } from 'react';
import Button from '../ui/Button';

export default function AudioToggle() {
  const [on, setOn] = useState(true);

  return (
    <Button
      onClick={() => setOn(!on)}
      className="audio-toggle"
      aria-label={on ? "Sound On" : "Sound Off"}
    >
      {on ? "🔊" : "🔇"}
    </Button>
  );
}
