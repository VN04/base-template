import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GameArea = ({ onGameOver, score }) => {
  const [dinoPos, setDinoPos] = useState(50);
  const [hurdles, setHurdles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(10);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !isJumping) {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isJumping]);

  const jump = () => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setHurdles((prevHurdles) => {
        let newHurdles = prevHurdles.map(h => ({ ...h, x: h.x - gameSpeed }));
        if (Math.random() < 0.02) {
          newHurdles.push({ x: 800, height: Math.random() > 0.5 ? 50 : 100 });
        }
        newHurdles = newHurdles.filter(h => h.x > -50);
        return newHurdles;
      });

      if (hurdles.some(h => 
        h.x < 100 && h.x > 0 && ((!isJumping && dinoPos < h.height + 20) || (isJumping && dinoPos > h.height - 20))
      )) {
        clearInterval(gameLoop);
        onGameOver();
      }

      if (score % 500 === 0 && score !== 0) {
        setGameSpeed(s => s + 1);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [dinoPos, hurdles, gameSpeed, isJumping, onGameOver, score]);

  return (
    <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
      <div 
        className="absolute bottom-0 left-10 w-10 h-10 bg-green-500" 
        style={{ bottom: `${dinoPos}px` }}
      ></div>
      {hurdles.map((hurdle, idx) => (
        <div 
          key={idx} 
          className="absolute bottom-0 bg-red-500" 
          style={{ left: `${hurdle.x}px`, width: '20px', height: `${hurdle.height}px` }}
        ></div>
      ))}
    </div>
  );
};

export default function App() {
  const [gameOn, setGameOn] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameOn(true);
    setScore(0);
  };

  const gameOver = useCallback(() => {
    setGameOn(false);
  }, []);

  useEffect(() => {
    if (gameOn) {
      const scoreInterval = setInterval(() => {
        setScore(s => s + 10);
      }, 100);
      return () => clearInterval(scoreInterval);
    }
  }, [gameOn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <Card className="w-full max-w-sm mb-4">
        <CardHeader>
          <CardTitle>Dino Jump</CardTitle>
        </CardHeader>
        <CardContent>
          {gameOn ? (
            <GameArea onGameOver={gameOver} score={score} />
          ) : (
            <div className="text-center">
              <p className="mb-4">Score: {score}</p>
              <Button onClick={startGame}>Start Game</Button>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-white mt-4">Press Space to Jump!</p>
      <p className="text-white">Score: {score}</p>
    </div>
  );
}