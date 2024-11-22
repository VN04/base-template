import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const generateRandomText = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?"(){}[]';
  let result = '';
  for (let i = 0; i < length; i++) {
    if (i > 0 && i % 20 === 0) result += '\n'; // New line every 20 characters
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function App() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [error, setError] = useState('');
  const [textLength, setTextLength] = useState(100);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerOn]);

  const startTest = () => {
    if (!isStarted) {
      setIsStarted(true);
      setTimerOn(true);
      setUserInput('');
      setText(generateRandomText(textLength));
    }
  };

  const handleInputChange = (e) => {
    if (!isStarted || !timerOn) return;
    const input = e.target.value;
    if (text.startsWith(input)) {
      setUserInput(input);
      setError('');
      if (input === text) {
        setTimerOn(false);
      }
    } else {
      setError('Typing error detected!');
    }
  };

  const stopTest = () => {
    setTimerOn(false);
    setIsStarted(false);
  };

  const restartTest = () => {
    stopTest();
    startTest();
  };

  const regenerateText = () => {
    setText(generateRandomText(textLength));
    setUserInput('');
  };

  const handleLengthChange = (e) => {
    const length = parseInt(e.target.value, 10);
    if (length >= 100 && length <= 1000) {
      setTextLength(length);
      setError('');
    } else {
      setError('Please select a length between 100 and 1000.');
    }
  };

  const speed = () => {
    if (timeElapsed === 0) return 0;
    return Math.round((userInput.length / timeElapsed) * 60);
  };

  const highlightText = () => {
    const correctPart = text.slice(0, userInput.length);
    const incorrectPart = text.slice(userInput.length, userInput.length + 1);
    const remainingPart = text.slice(userInput.length + 1);

    return (
      <div>
        <span style={{ backgroundColor: 'lightgreen' }}>{correctPart}</span>
        {error && (
          <span style={{ backgroundColor: 'red', color: 'white' }}>
            {incorrectPart}
          </span>
        )}
        <span>{remainingPart}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Typing Speed Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="number"
              value={textLength}
              onChange={handleLengthChange}
              placeholder="Text length (100-1000)"
              className="mb-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="text-lg mb-4">{highlightText()}</div>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            disabled={!isStarted}
            onPaste={(e) => e.preventDefault()}
            className="w-full h-40 p-2 border rounded resize-none"
            placeholder="Start typing here when you're ready..."
          />
          <div className="mt-4 flex justify-between">
            {!isStarted ? (
              <Button onClick={startTest}>Start</Button>
            ) : (
              <>
                <Button onClick={stopTest} variant="destructive">
                  Stop
                </Button>
                <Button onClick={restartTest}>Restart</Button>
                <Button onClick={regenerateText}>Regenerate Text</Button>
              </>
            )}
          </div>
          <div className="mt-4 text-center">
            {timerOn && <p>Time: {timeElapsed} seconds</p>}
            {!timerOn && userInput.length > 0 && (
              <p>Your speed: {speed()} CPM</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
