import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const generateLoremIpsum = (length) => {
  const words =
    'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(
      ' '
    );
  let result = '';
  while (result.length < length) {
    const word = words[Math.floor(Math.random() * words.length)];
    result += (result.length ? ' ' : '') + word;
  }
  return result.slice(0, length).trim() + '.';
};

const addPunctuation = (text) => {
  const punctuations = [',', '!', '?', ';', ':', '(', ')', '"', "'"];
  return text
    .split(' ')
    .map((word) => {
      if (Math.random() < 0.2) {
        return (
          word + punctuations[Math.floor(Math.random() * punctuations.length)]
        );
      }
      return word;
    })
    .join(' ');
};

const addNewLines = (text) => {
  return text.split(' ').reduce((acc, word, index) => {
    if (index > 0 && index % 10 === 0) {
      return acc + '\n' + word;
    }
    return acc + ' ' + word;
  });
};

export default function App() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [paragraphLength, setParagraphLength] = useState(100);
  const [error, setError] = useState('');

  const generateText = useCallback(() => {
    const rawText = generateLoremIpsum(paragraphLength);
    const punctuatedText = addPunctuation(rawText);
    const finalText = addNewLines(punctuatedText);
    setText(finalText);
  }, [paragraphLength]);

  useEffect(() => {
    generateText();
  }, [generateText]);

  useEffect(() => {
    let interval;
    if (isStarted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    setUserInput('');
    setTimer(0);
    setSpeed(0);
  };

  const handleStop = () => {
    setIsStarted(false);
    calculateSpeed();
  };

  const handleRestart = () => {
    setIsStarted(false);
    setUserInput('');
    setTimer(0);
    setSpeed(0);
    generateText();
  };

  const calculateSpeed = () => {
    const minutes = timer / 60;
    const charactersTyped = userInput.length;
    setSpeed(Math.round(charactersTyped / minutes));
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input === text.slice(0, input.length)) {
      setUserInput(input);
      if (input === text) {
        setIsStarted(false);
        calculateSpeed();
      }
    }
  };

  const handleLengthChange = (value) => {
    const length = value[0];
    if (length < 100 || length > 1000) {
      setError('Please select a length between 100 and 1000 characters.');
    } else {
      setError('');
      setParagraphLength(length);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Typing Speed Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">
              Paragraph Length: {paragraphLength} characters
            </p>
            <Slider
              min={100}
              max={1000}
              step={10}
              value={[paragraphLength]}
              onValueChange={handleLengthChange}
              className="mb-2"
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="bg-white p-4 rounded-md mb-4 whitespace-pre-wrap">
            {text.split('').map((char, index) => (
              <span
                key={index}
                className={
                  index < userInput.length
                    ? userInput[index] === char
                      ? 'bg-green-200'
                      : 'bg-red-200'
                    : ''
                }
              >
                {char}
              </span>
            ))}
          </div>
          <Input
            value={userInput}
            onChange={handleInputChange}
            disabled={!isStarted}
            className="mb-4"
            placeholder={isStarted ? 'Start typing...' : 'Press Start to begin'}
            onPaste={(e) => e.preventDefault()}
          />
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handleStart} disabled={isStarted}>
              Start
            </Button>
            <Button onClick={handleStop} disabled={!isStarted}>
              Stop
            </Button>
            <Button onClick={handleRestart}>Restart</Button>
            <Button onClick={generateText}>Regenerate Text</Button>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">Time: {timer} seconds</p>
            <p className="text-xl font-bold">
              Speed: {speed} characters per minute
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
