import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function generateQuestion() {
  const operations = ['+', '-', '*', '/'];
  const num1 = Math.floor(Math.random() * 101);
  const num2 = Math.floor(Math.random() * 101);
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let correctAnswer;

  switch (operation) {
    case '+': correctAnswer = num1 + num2; break;
    case '-': correctAnswer = num1 - num2; break;
    case '*': correctAnswer = num1 * num2; break;
    case '/': correctAnswer = parseFloat((num1 / (num2 === 0 ? 1 : num2)).toFixed(2)); break;
  }

  // Randomly choose the missing component (num1, num2, or operation)
  const missingIndex = Math.floor(Math.random() * 3);
  const components = [num1, operation, num2];
  const missingComponent = components[missingIndex];
  components[missingIndex] = '?';

  return {
    questionText: `${components[0]} ${components[1]} ${components[2]} = ${correctAnswer}`,
    correctAnswer: missingComponent.toString(), // Ensure string comparison for consistent input handling
    missingIndex,
  };
}

function Quiz() {
  const [question, setQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const isCorrect = userAnswer.trim() === question.correctAnswer;
    setResult(isCorrect ? "Correct!" : `Wrong. The correct answer is ${question.correctAnswer}`);
    if (isCorrect) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < 10) {
      setQuestion(generateQuestion());
      setUserAnswer('');
      setResult(null);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(1);
    setScore(0);
    setQuestion(generateQuestion());
    setUserAnswer('');
    setResult(null);
  };

  if (currentQuestion > 10) {
    return (
      <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">Quiz Finished!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-xl text-gray-700 mb-4">Your score: {score} / 10</p>
          <Button onClick={restartQuiz} className="w-full bg-blue-500 text-white hover:bg-blue-700 transition-all">
            Restart Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl rounded-lg bg-white p-6">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">Math Quiz</CardTitle>
        <p className="text-center text-sm text-gray-600">Question {currentQuestion} of 10</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg text-center font-medium text-gray-700">{question.questionText}</div>
        <div className="flex justify-center">
          <Input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Fill in the missing part"
            className="w-3/4 p-4 text-lg border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white hover:bg-green-700 transition-all w-36"
          >
            Submit
          </Button>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleNextQuestion}
            disabled={result === null} // Disable the "Next" button until an answer is submitted
            className="bg-blue-500 text-white hover:bg-blue-700 transition-all w-36"
          >
            Next Question
          </Button>
        </div>
        <div className="flex justify-center space-x-4"> {result && (
            <p className={`text-xl font-semibold ${result.includes("Correct") ? 'text-green-500' : 'text-red-500'}`}>
              {result}
            </p>
          )}</div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 flex items-center justify-center">
      <Quiz />
    </div>
  );
}
