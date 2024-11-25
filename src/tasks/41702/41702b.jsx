import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { shuffle } from 'lodash';

function Cup({ hasBall, onClick, id }) {
  return (
    <div className="w-1/3 p-2">
      <Card className="h-40 cursor-pointer" onClick={() => onClick(id)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className={`rounded-full w-12 h-12 ${hasBall ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [cups, setCups] = useState([{ id: 1, hasBall: false }, { id: 2, hasBall: true }, { id: 3, hasBall: false }]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isJumbling, setIsJumbling] = useState(false);
  const [userGuess, setUserGuess] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isJumbling) {
      const timer = setTimeout(() => {
        setCups(shuffle(cups));
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isJumbling, cups]);

  const startGame = () => {
    setCups(shuffle([...cups, { id: 4, hasBall: false }]).slice(1, 4));
    setIsGameActive(true);
    setIsJumbling(true);
    setUserGuess(null);
    setTimeout(() => setIsJumbling(false), 3000);
  };

  const handleGuess = (id) => {
    if (!userGuess) {
      const newCups = cups.map(cup => {
        if (cup.id === id) cup.clicked = true;
        return cup;
      });
      setCups(newCups);
      setUserGuess(id);
      if (cups.find(cup => cup.id === id).hasBall) {
        setScore(score + 1);
      }
    }
  };

  const endGame = () => {
    setIsGameActive(false);
  };

  const revealBall = () => {
    return cups.find(cup => cup.hasBall)?.id;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Cup and Ball Game</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-wrap justify-center mb-4">
            {cups.map(cup => (
              <Cup 
                key={cup.id} 
                id={cup.id} 
                hasBall={cup.clicked ? cup.hasBall : false} 
                onClick={handleGuess} 
              />
            ))}
          </div>
          {userGuess && (
            <p className="mb-4">
              {userGuess === revealBall() ? 'Correct!' : `Wrong! The ball was in cup ${revealBall()}.`}
            </p>
          )}
          <div className="flex justify-center space-x-4">
            {!isGameActive ? (
              <Button onClick={startGame}>Start Game</Button>
            ) : (
              <>
                <Button onClick={endGame} variant="destructive">End Game</Button>
                <Button onClick={startGame} disabled={isJumbling}>Restart</Button>
              </>
            )}
          </div>
        </CardContent>
        {isGameActive && (
          <CardFooter>
            <p>Score: {score}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}