import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const operators = ["+", "-", "*", "/", "%"];
const scientificOperations = [
  "sin",
  "cos",
  "tan",
  "log",
  "ln",
  "sqrt",
  "^",
  "π",
  "e",
];

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const handleButtonClick = useCallback((value) => {
    setInput((prev) => prev + value);
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setResult("");
  }, []);

  const handleBackspace = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  const handleCalculate = useCallback(() => {
    try {
      let expression = input
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E");

      const calculatedResult = eval(expression);
      setResult(calculatedResult.toString());
      setHistory((prev) => [
        { input, result: calculatedResult.toString() },
        ...prev.slice(0, 19),
      ]);
    } catch (error) {
      setResult("Error");
    }
  }, [input]);

  const renderButton = useCallback(
    (value, className = "") => (
      <Button
        className={`w-full h-12 text-lg font-semibold ${className}`}
        onClick={() => handleButtonClick(value)}
      >
        {value}
      </Button>
    ),
    [handleButtonClick]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Scientific Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              value={input}
              readOnly
              className="w-full p-2 text-right text-xl border rounded"
            />
            <div className="mt-2 text-right text-2xl font-bold">{result}</div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {renderButton("C", "col-span-2 bg-red-500 hover:bg-red-600")}
            {renderButton("⌫", "bg-yellow-500 hover:bg-yellow-600")}
            {renderButton("(", "bg-gray-300 hover:bg-gray-400")}
            {renderButton(")", "bg-gray-300 hover:bg-gray-400")}
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => renderButton(num))}
            {renderButton("0", "col-span-2")}
            {renderButton(".")}
            {operators.map((op) =>
              renderButton(op, "bg-blue-500 hover:bg-blue-600")
            )}
            {scientificOperations.map((op) =>
              renderButton(op, "bg-green-500 hover:bg-green-600")
            )}
            {renderButton("=", "col-span-2 bg-purple-500 hover:bg-purple-600")}
          </div>
          <Button
            className="w-full mt-4 bg-purple-500 hover:bg-purple-600"
            onClick={handleCalculate}
          >
            Calculate
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md ml-4 hidden sm:block">
        <CardHeader>
          <CardTitle className="text-xl font-bold">History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {history.map((item, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                <div className="font-semibold">{item.input}</div>
                <div className="text-right">{item.result}</div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}