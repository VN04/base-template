import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GAME_HEIGHT = 300;
const DINO_HEIGHT = 60;
const DINO_WIDTH = 60;
const HURDLE_WIDTH = 20;
const HURDLE_HEIGHT = 40;
const JUMP_HEIGHT = 100;
const JUMP_DURATION = 500;

const Dinosaur = ({ bottom }) => (
  <div
    className="absolute left-10"
    style={{
      bottom,
      width: DINO_WIDTH,
      height: DINO_HEIGHT,
      backgroundColor: "green",
      transition: `bottom ${JUMP_DURATION}ms ease-out`,
    }}
  />
);

const Hurdle = ({ left, height }) => (
  <div
    className="absolute bottom-0"
    style={{
      left,
      width: HURDLE_WIDTH,
      height,
      backgroundColor: "red",
    }}
  />
);

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dinoBottom, setDinoBottom] = useState(0);
  const [hurdles, setHurdles] = useState([]);
  const [speed, setSpeed] = useState(5);

  const jump = useCallback(() => {
    if (dinoBottom === 0) {
      setDinoBottom(JUMP_HEIGHT);
      setTimeout(() => setDinoBottom(0), JUMP_DURATION);
    }
  }, [dinoBottom]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setHurdles([]);
    setSpeed(5);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore % 500 === 0) {
          setSpeed((prevSpeed) => prevSpeed + 1);
        }
        return newScore;
      });

      setHurdles((prevHurdles) => {
        const newHurdles = prevHurdles
          .map((hurdle) => ({ ...hurdle, left: hurdle.left - speed }))
          .filter((hurdle) => hurdle.left > -HURDLE_WIDTH);

        if (Math.random() < 0.02 && prevHurdles.length < 3) {
          newHurdles.push({
            left: window.innerWidth,
            height: Math.random() < 0.5 ? HURDLE_HEIGHT : HURDLE_HEIGHT * 1.5,
          });
        }

        return newHurdles;
      });

      const dino = {
        left: 10,
        right: 10 + DINO_WIDTH,
        top: GAME_HEIGHT - DINO_HEIGHT - dinoBottom,
        bottom: dinoBottom,
      };

      const collision = hurdles.some(
        (hurdle) =>
          hurdle.left < dino.right &&
          hurdle.left + HURDLE_WIDTH > dino.left &&
          GAME_HEIGHT - hurdle.height < dino.top + DINO_HEIGHT
      );

      if (collision) {
        setGameOver(true);
        setGameStarted(false);
        clearInterval(gameLoop);
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, hurdles, dinoBottom, speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!gameStarted && !gameOver) {
          startGame();
        } else if (gameStarted) {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver, jump]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Dino Jump Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-white border-2 border-gray-300 overflow-hidden"
            style={{ height: GAME_HEIGHT }}
          >
            {gameStarted && (
              <>
                <Dinosaur bottom={dinoBottom} />
                {hurdles.map((hurdle, index) => (
                  <Hurdle key={index} left={hurdle.left} height={hurdle.height} />
                ))}
              </>
            )}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startGame}>Start Game</Button>
              </div>
            )}
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                <h2 className="text-2xl font-bold mb-4">Game Over</h2>
                <p className="text-xl mb-4">Score: {score}</p>
                <Button onClick={startGame}>Restart</Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-lg font-semibold">Score: {score}</div>
          <Button onClick={jump} disabled={!gameStarted || gameOver}>
            Jump
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}