import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scientificFunctions = [
  'sin', 'cos', 'tan', 'log', 'sqrt', 'π', 'e'
];

const operations = ['+', '-', '*', '/', '%'];

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [lastOperation, setLastOperation] = useState(null);

  const handleNumberClick = useCallback((num) => {
    setDisplay(prev => prev === '0' ? String(num) : prev + num);
  }, []);

  const handleOperationClick = useCallback((op) => {
    setDisplay(display + ' ' + op + ' ');
    setLastOperation(op);
  }, [display]);

  const handleFunctionClick = useCallback((func) => {
    setDisplay(prev => `${func}(${prev})`);
  }, []);

  const calculate = useCallback(() => {
    try {
      // Here we're using eval for simplicity. In a real-world scenario, 
      // use a safer method to evaluate expressions.
      setDisplay(String(eval(display.replace('π', 'Math.PI').replace('e', 'Math.E'))));
    } catch (e) {
      setDisplay('Error');
    }
  }, [display]);

  const clearDisplay = useCallback(() => {
    setDisplay('0');
  }, []);

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 sm:max-w-lg">
      <CardHeader>
        <CardTitle>Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent className="text-right p-4">
        <div className="text-3xl mb-4">{display}</div>
        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', 'C'].map(num => (
            <Button variant={num === 'C' ? "destructive" : "default"} key={num} onClick={() => num === 'C' ? clearDisplay() : handleNumberClick(num)}>{num}</Button>
          ))}
          {['4', '5', '6', '*'].map(op => (
            <Button key={op} onClick={() => op === '*' ? handleOperationClick(op) : handleNumberClick(op)}>{op}</Button>
          ))}
          {['1', '2', '3', '-'].map(op => (
            <Button key={op} onClick={() => op === '-' ? handleOperationClick(op) : handleNumberClick(op)}>{op}</Button>
          ))}
          {['0', '.', '=', '+'].map(op => (
            <Button key={op} onClick={() => {
              if (op === '=') calculate();
              else if (op === '.') handleNumberClick(op);
              else op === '+' ? handleOperationClick(op) : handleNumberClick(op);
            }}>{op}</Button>
          ))}
          {['/', '%', '(', ')'].map(op => (
            <Button key={op} onClick={() => handleOperationClick(op)}>{op}</Button>
          ))}
          {scientificFunctions.map(func => (
            <Button key={func} onClick={() => handleFunctionClick(func)}>{func}</Button>
          ))}
          <Button onClick={() => handleFunctionClick('^')}>^</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Calculator />
    </div>
  );
}