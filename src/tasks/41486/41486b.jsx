import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const words = [
  'computer', 'keyboard', 'monitor', 'software', 'hardware', 'network', 'internet', 'browser', 'database', 'algorithm'
].map(word => ({
  original: word,
  jumbled: shuffleArray([...word]).join(''),
}));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function App() {
  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (words[currentWord].jumbled === words[currentWord].original) {
      setCurrentWord(prev => (prev + 1) % words.length);
    }
  }, [currentWord]);

  const handleSubmit = () => {
    if (userInput.toLowerCase() === words[currentWord].original) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleHint = () => {
    if (hintsUsed < 3) {
      const correctWord = words[currentWord].original;
      let hintWord = userInput.split('');
      for (let i = 0; i < correctWord.length; i++) {
        if (hintWord[i] !== correctWord[i]) {
          hintWord[i] = correctWord[i];
          break;
        }
      }
      setUserInput(hintWord.join(''));
      setHintsUsed(hintsUsed + 1);
    }
  };

  const nextWord = () => {
    setUserInput('');
    setIsCorrect(null);
    setHintsUsed(0);
    setCurrentWord((currentWord + 1) % words.length);
  };

  const restartGame = () => {
    setCurrentWord(0);
    setScore(0);
    setUserInput('');
    setIsCorrect(null);
    setHintsUsed(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg mt-8">
        <CardHeader>
          <CardTitle>Jumbled Words Game</CardTitle>
        </CardHeader>
        <CardContent>
          {currentWord < words.length ? (
            <>
              <p className="text-center text-lg mb-4">Word {currentWord + 1} of {words.length}</p>
              <div className="flex justify-center mb-4">
                {[...words[currentWord].jumbled].map((char, idx) => (
                  <Input 
                    key={idx} 
                    value={userInput[idx] || ''} 
                    onChange={(e) => {
                      const newInput = userInput.split('');
                      newInput[idx] = e.target.value.slice(-1);
                      setUserInput(newInput.join(''));
                    }}
                    className="w-12 mx-1 text-center"
                    maxLength={1}
                  />
                ))}
              </div>
              {isCorrect === true && <p className="text-green-600 text-center">Correct!</p>}
              {isCorrect === false && <p className="text-red-600 text-center">Wrong! The correct word was: {words[currentWord].original}</p>}
              <div className="flex justify-between mt-4">
                <Button onClick={handleSubmit} disabled={isCorrect !== null}>Submit</Button>
                <Button onClick={handleHint} disabled={hintsUsed >= 3 || isCorrect !== null}>Hint ({3 - hintsUsed} left)</Button>
                <Button onClick={nextWord} disabled={isCorrect === null}>Next</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl text-center mb-4">Game Over! Your score is {score}/{words.length}</p>
              <Button onClick={restartGame} className="w-full">Restart Game</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}