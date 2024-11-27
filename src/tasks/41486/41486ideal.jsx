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
  const [isSubmitted, setSubmit] = useState(false);
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
    if (!isSubmitted) {
      const userWord = userInput.join("");
      if (userWord === words[currentWordIndex]) {
        setScore(score + 1);
      }
      setShowAnswer(true);
      setSubmit(true);
    }
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
    setSubmit(false);
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setHintsUsed(0);
    setSubmit(false);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md sm:max-w-lg shadow-xl rounded-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-purple-800">Jumbled Words Game</CardTitle>
        </CardHeader>
        <CardContent>
          {!gameOver ? (
            <>
              <div className="text-center mb-6">
                <span className="text-2xl sm:text-3xl font-semibold text-purple-700">{jumbledWord}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
                {userInput.map((char, index) => (
                  <Input
                    key={index}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center rounded-lg border-purple-300 shadow-sm text-lg"
                    value={char}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    maxLength={1}
                  />
                ))}
              </div>
              {showAnswer && (
                <Alert className={`mb-6 ${userInput.join("") === words[currentWordIndex] ? "bg-green-100" : "bg-red-100"}`}>
                  <AlertTitle className="font-bold text-lg">
                    {userInput.join("") === words[currentWordIndex] ? "Correct!" : "Incorrect!"}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {userInput.join("") === words[currentWordIndex]
                      ? "Well done!"
                      : `The correct word was: ${words[currentWordIndex]}`}
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-wrap justify-between gap-4 sm:gap-6 mb-4">
                <Button
                  className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                >
                  Submit
                </Button>
                <Button
                  className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleHint}
                  disabled={hintsUsed >= 3}
                >
                  Hint ({3 - hintsUsed} left)
                </Button>
                <Button
                  className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600"
                  onClick={handleNextWord}
                  disabled={!isSubmitted}
                >
                  Next Word
                </Button>
              </div>
              <div className="text-center">
                <span className="font-semibold text-gray-700">
                  Word {currentWordIndex + 1} of {words.length} | Score: {score}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Game Over!</h2>
              <p className="text-lg mb-6">Your final score: {score} out of {words.length}</p>
              <Button
                className="bg-indigo-500 text-white hover:bg-indigo-600"
                onClick={restartGame}
              >
                Restart Game
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
          Jumbled Words Game - React + Tailwind + Shadcn
        </CardFooter>
      </Card>
    </div>
  );
}
