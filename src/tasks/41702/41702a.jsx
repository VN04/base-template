import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Cup = ({ onClick, revealed, hasBall }) => (
  <div
    className="w-24 h-32 bg-blue-500 rounded-b-full cursor-pointer transform transition-transform hover:scale-105"
    onClick={onClick}
  >
    {revealed && (
      <div className={`w-8 h-8 rounded-full mx-auto mt-4 ${hasBall ? "bg-yellow-400" : "bg-transparent"}`} />
    )}
  </div>
);

const GameBoard = ({ cups, onCupClick, gameState }) => (
  <div className="flex justify-center space-x-8 my-8">
    {cups.map((cup, index) => (
      <Cup
        key={index}
        onClick={() => onCupClick(index)}
        revealed={gameState === "result"}
        hasBall={cup}
      />
    ))}
  </div>
);

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [cups, setCups] = useState([false, false, false]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("idle");
  const [message, setMessage] = useState("");

  const startGame = () => {
    const initialCups = [true, false, false];
    setCups(shuffleArray(initialCups));
    setGameState("playing");
    setMessage("");
  };

  const endGame = () => {
    setGameState("idle");
    setMessage(`Game Over! Your score: ${score}`);
  };

  const handleCupClick = (index) => {
    if (gameState !== "playing") return;

    setGameState("result");
    if (cups[index]) {
      setScore(score + 1);
      setMessage("Correct! You found the ball!");
    } else {
      setMessage("Wrong! The ball was in another cup.");
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === "playing") {
      timer = setTimeout(() => {
        setCups((prevCups) => shuffleArray(prevCups));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cup and Ball Game</CardTitle>
        </CardHeader>
        <CardContent>
          <GameBoard cups={cups} onCupClick={handleCupClick} gameState={gameState} />
          {message && (
            <p className="text-center font-semibold mt-4 text-lg">{message}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button
            onClick={startGame}
            disabled={gameState === "playing"}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Start Game
          </Button>
          <Button
            onClick={endGame}
            disabled={gameState === "idle"}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            End Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}