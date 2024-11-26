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
    className="absolute bg-green-500 rounded-md shadow-lg"
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
    className="absolute bg-red-500 rounded-sm shadow-md"
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
    className="absolute bg-gray-500 shadow-inner"
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
    if (gameState !== "playing") return;
  
    const gameLoop = setInterval(() => {
      // Update score and increase speed periodically
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore % 500 === 0) {
          setSpeed((prevSpeed) => prevSpeed + 0.5);
        }
        return newScore;
      });
  
      // Move hurdles and add new ones
      setHurdles((prevHurdles) => {
        const newHurdles = prevHurdles
          .map((hurdle) => ({ ...hurdle, left: hurdle.left - speed }))
          .filter((hurdle) => hurdle.left > -HURDLE_WIDTH); // Remove off-screen hurdles
  
        if (
          Math.random() < 0.02 &&
          (newHurdles.length === 0 || newHurdles[newHurdles.length - 1].left < GAME_WIDTH - 200)
        ) {
          newHurdles.push({ left: GAME_WIDTH });
        }
  
        return newHurdles;
      });
  
      // Bounding box for the dinosaur
      const dinoRect = {
        left: 50,
        right: 50 + DINO_WIDTH,
        top: GAME_HEIGHT - DINO_HEIGHT - GROUND_HEIGHT - dinoTop,
        bottom: GAME_HEIGHT - GROUND_HEIGHT - dinoTop,
      };
  
      // Check for collision with any hurdle
      const collision = hurdles.some((hurdle) => {
        const hurdleRect = {
          left: hurdle.left,
          right: hurdle.left + HURDLE_WIDTH,
          top: GAME_HEIGHT - HURDLE_HEIGHT - GROUND_HEIGHT,
          bottom: GAME_HEIGHT - GROUND_HEIGHT,
        };
  
        // Collision detection logic
        return (
          dinoRect.left < hurdleRect.right && // Horizontal overlap
          dinoRect.right > hurdleRect.left && // Horizontal overlap
          dinoRect.bottom > hurdleRect.top && // Vertical overlap
          dinoRect.top < hurdleRect.bottom // Vertical overlap
        );
      });
  
      if (collision) {
        setGameState("gameover");
        clearInterval(gameLoop);
      }
    }, 1000 / 60);
  
    return () => clearInterval(gameLoop);
  }, [gameState, speed, dinoTop, hurdles]);
  

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <Card className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Dino Run</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative mx-auto bg-gray-100 border border-gray-300 rounded-md shadow-md"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            <Dinosaur top={dinoTop} />
            {hurdles.map((hurdle, index) => (
              <Hurdle key={index} left={hurdle.left} />
            ))}
            <Ground />
          </div>
          <div className="mt-4 text-center text-2xl font-bold text-gray-700">Score: <span className="text-green-600">{score}</span></div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          {gameState === "idle" && (
            <Button onClick={startGame} className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">Start Game</Button>
          )}
          {gameState === "playing" && (
            <Button onClick={jump} className="px-6 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600">Jump</Button>
          )}
          {gameState === "gameover" && (
            <Button onClick={startGame}  className="px-6 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600">Restart Game</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}