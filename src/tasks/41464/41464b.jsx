import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 60;
const HURDLE_WIDTH = 20;
const HURDLE_HEIGHT = 40;
const GROUND_HEIGHT = 20;
const JUMP_HEIGHT = 100;
const INITIAL_SPEED = 5;

const Dinosaur = ({ top }) => (
  <div
    className="absolute bg-green-600"
    style={{
      left: 50,
      bottom: GROUND_HEIGHT,
      width: DINO_WIDTH,
      height: DINO_HEIGHT,
      transform: `translateY(-${top}px)`,
    }}
  />
);

const Hurdle = ({ left }) => (
  <div
    className="absolute bg-red-600"
    style={{
      left,
      bottom: GROUND_HEIGHT,
      width: HURDLE_WIDTH,
      height: HURDLE_HEIGHT,
    }}
  />
);

const Ground = () => (
  <div
    className="absolute bg-gray-400"
    style={{
      left: 0,
      bottom: 0,
      width: "100%",
      height: GROUND_HEIGHT,
    }}
  />
);

export default function App() {
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [dinoTop, setDinoTop] = useState(0);
  const [hurdles, setHurdles] = useState([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setDinoTop(0);
    setHurdles([]);
    setSpeed(INITIAL_SPEED);
  };

  const jump = useCallback(() => {
    if (dinoTop === 0) {
      setDinoTop(JUMP_HEIGHT);
      setTimeout(() => setDinoTop(0), 300);
    }
  }, [dinoTop]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        if (gameState === "playing") {
          jump();
        } else {
          startGame();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, jump]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore % 500 === 0) {
          setSpeed((prevSpeed) => prevSpeed + 0.5);
        }
        return newScore;
      });

      setHurdles((prevHurdles) => {
        const newHurdles = prevHurdles
          .map((hurdle) => ({ ...hurdle, left: hurdle.left - speed }))
          .filter((hurdle) => hurdle.left > -HURDLE_WIDTH);

        if (Math.random() < 0.02 && (newHurdles.length === 0 || newHurdles[newHurdles.length - 1].left < GAME_WIDTH - 200)) {
          newHurdles.push({ left: GAME_WIDTH });
        }

        return newHurdles;
      });

      const dinoRect = {
        left: 50,
        right: 50 + DINO_WIDTH,
        top: GAME_HEIGHT - DINO_HEIGHT - GROUND_HEIGHT - dinoTop,
        bottom: GAME_HEIGHT - GROUND_HEIGHT - dinoTop,
      };

      const collision = hurdles.some((hurdle) => {
        const hurdleRect = {
          left: hurdle.left,
          right: hurdle.left + HURDLE_WIDTH,
          top: GAME_HEIGHT - HURDLE_HEIGHT - GROUND_HEIGHT,
          bottom: GAME_HEIGHT - GROUND_HEIGHT,
        };

        return (
          dinoRect.left < hurdleRect.right &&
          dinoRect.right > hurdleRect.left &&
          dinoRect.top < hurdleRect.bottom &&
          dinoRect.bottom > hurdleRect.top
        );
      });

      if (collision) {
        setGameState("gameover");
        clearInterval(gameLoop);
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, speed, dinoTop]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Dino Run</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-white overflow-hidden mx-auto"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            <Dinosaur top={dinoTop} />
            {hurdles.map((hurdle, index) => (
              <Hurdle key={index} left={hurdle.left} />
            ))}
            <Ground />
          </div>
          <div className="mt-4 text-center text-xl font-semibold">Score: {score}</div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {gameState === "idle" && (
            <Button onClick={startGame}>Start Game</Button>
          )}
          {gameState === "playing" && (
            <Button onClick={jump}>Jump</Button>
          )}
          {gameState === "gameover" && (
            <Button onClick={startGame}>Restart Game</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}