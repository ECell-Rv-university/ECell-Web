"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Game2048 from "./Game2048";
import MemoryMatchGame from "./MemoryMatchGame";
import SnakeGame from "./SnakeGame";
import "./ArcadeGames.css";
import "./GameLauncher.css";

const ROUND_LENGTH = 15;
type GameId = "founder" | "snake" | "memory" | "2048";

const GAMES: Array<{ id: GameId; label: string; title: string; description: string; mark: string }> = [
  { id: "founder", label: "01", title: "Founder Sprint", description: "Catch every spark before the clock runs out.", mark: "✦" },
  { id: "snake", label: "02", title: "Signal Snake", description: "Guide the growing signal through the grid.", mark: "~" },
  { id: "memory", label: "03", title: "Memory Match", description: "Pair every hidden signal in the fewest moves.", mark: "=" },
  { id: "2048", label: "04", title: "2048", description: "Combine matching signals. Reach the target.", mark: "2" },
];

function SparkArcadeIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path className="game-launcher__spark" d="m16 4.25 1.8 6.02L23.75 12l-5.95 1.72L16 19.75l-1.8-6.03L8.25 12l5.95-1.73L16 4.25Z" />
      <path className="game-launcher__arcade" d="M9.1 17.1h13.8c2.12 0 3.74 1.9 3.38 3.98l-.72 4.19a2.34 2.34 0 0 1-3.82 1.45l-2.48-2.03h-6.52l-2.48 2.03a2.34 2.34 0 0 1-3.82-1.45l-.72-4.19A3.84 3.84 0 0 1 9.1 17.1Z" />
      <path className="game-launcher__arcade" d="M10.15 20.56v2.92m-1.46-1.46h2.92M21.3 20.9h.01m1.9 1.9h.01" />
    </svg>
  );
}

function CloseIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

export default function GameLauncher(): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_LENGTH);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [target, setTarget] = useState<{ x: number; y: number }>({ x: 52, y: 48 });
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const launcherButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const gameActive = isPlaying && timeLeft > 0;

  const closeWindow = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    setIsPlaying(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setSelectedGame(null);
      launcherButtonRef.current?.focus();
    }, 360);
  }, [isClosing, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWindow();
    };
    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeWindow, isOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!gameActive) return undefined;
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const moveTarget = () => {
    setScore((value) => value + 1);
    setTarget({
      x: 12 + Math.random() * 76,
      y: 14 + Math.random() * 68,
    });
  };

  const startRound = () => {
    setScore(0);
    setTimeLeft(ROUND_LENGTH);
    setTarget({ x: 52, y: 48 });
    setIsPlaying(true);
  };

  return (
    <aside className={`game-launcher ${isOpen ? "game-launcher--open" : ""} ${isClosing ? "game-launcher--closing" : ""}`}>
      {isOpen && (
        <>
          <div className="game-launcher__backdrop" aria-hidden="true" onClick={closeWindow} />
          <section className={`game-window ${selectedGame ? "game-window--playing" : "game-window--selection"}`} role="dialog" aria-labelledby="game-window-title">
            <header className="game-window__header">
              <div>
                <span className="game-window__eyebrow">ECELL // AFTER HOURS</span>
                <h2 id="game-window-title">{selectedGame ? GAMES.find((game) => game.id === selectedGame)?.title : "Arcade Select"}</h2>
              </div>
              <div className="game-window__actions">
                {selectedGame && <button className="game-window__back" type="button" onClick={() => setSelectedGame(null)}>Back</button>}
                <button ref={closeButtonRef} className="game-window__close" type="button" onClick={closeWindow} aria-label="Close arcade"><CloseIcon /></button>
              </div>
            </header>

            {!selectedGame && <div className="arcade-selection">
              <p className="arcade-selection__intro">Pick a quick break. Each game is built for a focused run.</p>
              <div className="arcade-selection__grid">
                {GAMES.map((game) => <button className="arcade-selection__card" type="button" key={game.id} onClick={() => setSelectedGame(game.id)}>
                  <span className="arcade-selection__label">{game.label}{" // PLAY"}</span><i>{game.mark}</i><strong>{game.title}</strong><span>{game.description}</span>
                </button>)}
              </div>
            </div>}

            {selectedGame === "founder" && <>
            <p className="game-window__intro">Build momentum. Catch every spark before the clock runs out.</p>

            <div className="game-stats" aria-live="polite">
              <span>SPARKS <strong>{String(score).padStart(2, "0")}</strong></span>
              <span>TIME <strong>{String(timeLeft).padStart(2, "0")}s</strong></span>
            </div>

            <div className="game-stage">
              {!gameActive && (
                <div className="game-stage__start">
                  <span>{timeLeft === 0 ? `Round complete — ${score} sparks` : "15-second focus round"}</span>
                  <button type="button" onClick={startRound}>{timeLeft === 0 ? "Play again" : "Start sprint"}</button>
                </div>
              )}
              {gameActive && (
                <button
                  className="game-target"
                  type="button"
                  onClick={moveTarget}
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                  aria-label="Collect spark"
                >
                  ✦
                </button>
              )}
            </div>
            </>}

            {selectedGame === "snake" && <SnakeGame />}
            {selectedGame === "memory" && <MemoryMatchGame />}
            {selectedGame === "2048" && <Game2048 />}

            <footer className="game-window__footer">
              <span>{selectedGame === "founder" && gameActive ? "Tap the moving spark" : selectedGame ? "Made for a quick break" : "Four quick breaks. One focused mode."}</span>
              <span className="game-window__status"><i /> ONLINE</span>
            </footer>
          </section>
        </>
      )}

      <button
        ref={launcherButtonRef}
        className="game-launcher__button"
        type="button"
        onClick={() => {
          if (isOpen) {
            closeWindow();
          } else {
            setIsClosing(false);
            setSelectedGame(null);
            setIsOpen(true);
          }
        }}
        aria-expanded={isOpen}
        aria-controls="game-window-title"
        aria-label={isOpen ? "Close arcade" : "Open arcade"}
      >
        <span className="game-launcher__icon"><SparkArcadeIcon /></span>
      </button>
    </aside>
  );
}
