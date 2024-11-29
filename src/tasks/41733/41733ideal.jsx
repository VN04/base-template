import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === '=') {
      calculate();
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const calculate = () => {
    try {
      // Replace the input with correct JavaScript syntax for exponentiation and constants
      let calcInput = input
        .replace(/\^/g, '**')        // Replace ^ with **
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sin|cos|tan/g, (match) => `Math.${match}`)
        .replace(/π/g, 'Math.PI')    // Replace π with Math.PI
        .replace(/e/g, 'Math.E')    // Replace e with Math.E
        .replace(/mod/g, '%'); 
      
      let calcResult = eval(calcInput);
  
      if (isNaN(calcResult)) throw new Error();
      setResult(calcResult.toString());
      setHistory(prev => {
        const newHistory = [{ expression: input, result: calcResult }, ...prev].slice(0, 20);
        return newHistory;
      });
    } catch (e) {
      setResult('Error');
    }
  };

  const buttons = useMemo(() => [
    'C', 'DEL', '(', ')', '^', '7', '8', '9', '/', 'sin',
    '4', '5', '6', '*', 'cos', '1', '2', '3', '-', 'tan',
    '0', '.', '=', '+', 'log', 'ln', 'mod', 'π', 'e'
  ], []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full">
        <Card>
          <CardHeader>
            <CardTitle>Scientific Calculator</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Input 
              type="text" 
              value={`${input}${result ? ' = ' + result : ''}`} 
              readOnly 
              className="text-right text-2xl"
            />
            <div className="grid grid-cols-5 gap-2">
              {buttons.map(button => (
                <Button 
                  key={button} 
                  variant={['C', 'DEL', '='].includes(button) ? 'destructive' : 'default'}
                  onClick={() => handleButtonClick(button)}
                >
                  {button}
                </Button>
              ))}
            </div>
            <ScrollArea className="h-40">
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    {item.expression} = {item.result}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;