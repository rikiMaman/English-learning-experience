"use client";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

type GameOverModalProps = {
  score: number;
  time: number; // seconds
  onRestart: () => void;
};

export default function GameOverModal({ score, time, onRestart }: GameOverModalProps) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const router = useRouter();


  const goToLeaderboard = () => {
    const gameId = localStorage.getItem("gameId");
    router.push(`/leaderboard/${gameId}`);
  };

  return (
    <div className="gameover-modal">
      <div className="gameover-modal__content">
        <h2 className="gameover-modal__title">🎉 The game end!</h2>

        <p className="gameover-modal__score">Last score: {score}</p>

        <p className="gameover-modal__time">
          Finish time: {minutes}:{seconds < 10 ? "0" + seconds : seconds}
        </p>

        <div className="gameover-modal__buttons">
          <Button onClick={goToLeaderboard} className="btn-primary gameover-modal__button">
            View Leaderboard
          </Button>
          <Button onClick={onRestart} className="btn-primary gameover-modal__button">
            Restart
          </Button>

        </div>
      </div>
    </div>
  );
}

