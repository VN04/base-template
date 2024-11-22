import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const words = [
  "REACT", "TAILWIND", "SHADCN", "JAVASCRIPT", "COMPONENT",
  "FUNCTION", "INTERFACE", "DEVELOPER", "APPLICATION", "PROGRAMMING"
];

function shuffleWord(word) {
  let shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
  return shuffled === word ? shuffleWord(word) : shuffled;
}

export default function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [jumbledWord, setJumbledWord] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (currentWordIndex < words.length) {
      setJumbledWord(shuffleWord(words[currentWordIndex]));
      setUserInput(Array(words[currentWordIndex].length).fill(""));
      setShowAnswer(false);
    } else {
      setGameOver(true);
    }
  }, [currentWordIndex]);

  const handleInputChange = (index, value) => {
    const newInput = [...userInput];
    newInput[index] = value.toUpperCase();
    setUserInput(newInput);
  };

  const handleSubmit = () => {
    const userWord = userInput.join("");
    if (userWord === words[currentWordIndex]) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleHint = () => {
    if (hintsUsed < 3) {
      const currentWord = words[currentWordIndex];
      const newInput = [...userInput];
      for (let i = 0; i < currentWord.length; i++) {
        if (newInput[i] !== currentWord[i]) {
          newInput[i] = currentWord[i];
          break;
        }
      }
      setUserInput(newInput);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const handleNextWord = () => {
    setCurrentWordIndex(currentWordIndex + 1);
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setHintsUsed(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Jumbled Words Game</CardTitle>
        </CardHeader>
        <CardContent>
          {!gameOver ? (
            <>
              <div className="text-center mb-4">
                <span className="text-xl sm:text-2xl font-semibold">{jumbledWord}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
                {userInput.map((char, index) => (
                  <Input
                    key={index}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center"
                    value={char}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
              {showAnswer && (
                <Alert className="mb-4">
                  <AlertTitle>Answer</AlertTitle>
                  <AlertDescription>
                    {userInput.join("") === words[currentWordIndex]
                      ? "Correct!"
                      : `The correct word is: ${words[currentWordIndex]}`}
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-wrap justify-between gap-2 sm:gap-4 mb-4">
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleHint} disabled={hintsUsed >= 3}>
                  Hint ({3 - hintsUsed} left)
                </Button>
                <Button onClick={handleNextWord}>Next Word</Button>
              </div>
              <div className="text-center">
                <span className="font-semibold">
                  Word {currentWordIndex + 1} of {words.length} | Score: {score}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Your final score: {score} out of {words.length}</p>
              <Button onClick={restartGame}>Restart Game</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Jumbled Words Game - React + Tailwind + Shadcn
        </CardFooter>
      </Card>
    </div>
  );
}
