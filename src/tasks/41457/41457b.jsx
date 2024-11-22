import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function generateQuestion() {
  const operations = ['+', '-', '*', '/'];
  const num1 = Math.floor(Math.random() * 101);
  const num2 = Math.floor(Math.random() * 101);
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let correctAnswer;
  switch(operation) {
    case '+': correctAnswer = num1 + num2; break;
    case '-': correctAnswer = num1 - num2; break;
    case '*': correctAnswer = num1 * num2; break;
    case '/': correctAnswer = num1 / (num2 === 0 ? 1 : num2); break;
  }
  return { num1, num2, operation, correctAnswer };
}

function Quiz() {
  const [question, setQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const isCorrect = parseFloat(userAnswer) === question.correctAnswer;
    setResult(isCorrect ? "Correct!" : `Wrong. The correct answer is ${question.correctAnswer}`);
    if (isCorrect) setScore(score + 1);
    if (currentQuestion < 10) {
      setTimeout(() => {
        setQuestion(generateQuestion());
        setUserAnswer('');
        setResult(null);
        setCurrentQuestion(currentQuestion + 1);
      }, 1000);
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
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Quiz Finished!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your score: {score} / 10</p>
          <Button onClick={restartQuiz}>Restart Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-4">
      <CardHeader>
        <CardTitle>Math Quiz</CardTitle>
        <p>Question {currentQuestion} of 10</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>{question.num1} {question.operation} {question.num2} = ?</div>
        <Input 
          type="number" 
          value={userAnswer} 
          onChange={(e) => setUserAnswer(e.target.value)} 
          placeholder="Your answer"
        />
        <Button onClick={handleSubmit}>Submit</Button>
        {result && <p>{result}</p>}
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Quiz />
    </div>
  );
}