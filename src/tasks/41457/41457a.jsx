import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const operations = ["+", "-", "*", "/"];

const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 101);
  const num2 = Math.floor(Math.random() * 101);
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const answer = eval(`${num1} ${operation} ${num2}`);
  return { num1, num2, operation, answer: Number(answer.toFixed(2)) };
};

const QuizQuestion = ({ question, onSubmit }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    const isCorrect = parseFloat(userAnswer) === question.answer;
    setResult(isCorrect);
    onSubmit(isCorrect);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Math Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-4 text-xl">
          <span>{question.num1}</span>
          <span>{question.operation}</span>
          <span>{question.num2}</span>
          <span>=</span>
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-20 text-center"
          />
        </div>
        {result !== null && (
          <Alert className={`mt-4 ${result ? "bg-green-100" : "bg-red-100"}`}>
            <AlertTitle>{result ? "Correct!" : "Incorrect"}</AlertTitle>
            <AlertDescription>
              {result ? "Great job!" : `The correct answer is ${question.answer}`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleSubmit} disabled={result !== null}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [questions, setQuestions] = useState(() => Array(10).fill().map(generateQuestion));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleSubmit = useCallback((isCorrect) => {
    if (isCorrect) setScore((prevScore) => prevScore + 1);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < 9) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  }, [currentQuestion]);

  const restartQuiz = useCallback(() => {
    setQuestions(Array(10).fill().map(generateQuestion));
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {!quizComplete ? (
        <>
          <QuizQuestion
            question={questions[currentQuestion]}
            onSubmit={handleSubmit}
          />
          <Button onClick={handleNextQuestion} className="mt-4">
            {currentQuestion < 9 ? "Next Question" : "Finish Quiz"}
          </Button>
          <p className="mt-4 text-lg">
            Question {currentQuestion + 1} of 10 | Score: {score}
          </p>
        </>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center">
              Your final score is: {score} out of 10
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={restartQuiz}>Restart Quiz</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}