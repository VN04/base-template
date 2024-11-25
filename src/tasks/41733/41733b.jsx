import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalculatorButton = ({ onClick, className, children }) => (
  <Button
    onClick={onClick}
    className={`w-full h-12 text-lg font-semibold ${className}`}
  >
    {children}
  </Button>
);

const CalculatorDisplay = ({ value }) => (
  <div className="w-full h-16 bg-gray-100 rounded-md mb-4 flex items-center justify-end px-4 text-2xl font-bold overflow-x-auto">
    {value}
  </div>
);

export default function App() {
  const [display, setDisplay] = useState("0");
  const [currentValue, setCurrentValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay("0");
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const currentValueNum = currentValue || 0;
      const newValue = calculate(currentValueNum, inputValue, operator);
      setCurrentValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      case "%":
        return a % b;
      default:
        return b;
    }
  };

  const calculateResult = () => {
    if (operator && currentValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(currentValue, inputValue, operator);
      setDisplay(String(result));
      setCurrentValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const calculateSpecialFunction = (func) => {
    const inputValue = parseFloat(display);
    let result;
    switch (func) {
      case "sin":
        result = Math.sin(inputValue);
        break;
      case "cos":
        result = Math.cos(inputValue);
        break;
      case "tan":
        result = Math.tan(inputValue);
        break;
      case "log":
        result = Math.log10(inputValue);
        break;
      case "ln":
        result = Math.log(inputValue);
        break;
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      default:
        return;
    }
    setDisplay(String(result));
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Scientific Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalculatorDisplay value={display} />
          <div className="grid grid-cols-4 gap-2">
            <CalculatorButton onClick={() => calculateSpecialFunction("sin")}>
              sin
            </CalculatorButton>
            <CalculatorButton onClick={() => calculateSpecialFunction("cos")}>
              cos
            </CalculatorButton>
            <CalculatorButton onClick={() => calculateSpecialFunction("tan")}>
              tan
            </CalculatorButton>
            <CalculatorButton onClick={() => performOperation("%")}>
              %
            </CalculatorButton>
            <CalculatorButton onClick={() => calculateSpecialFunction("log")}>
              log
            </CalculatorButton>
            <CalculatorButton onClick={() => calculateSpecialFunction("ln")}>
              ln
            </CalculatorButton>
            <CalculatorButton onClick={() => calculateSpecialFunction("sqrt")}>
              √
            </CalculatorButton>
            <CalculatorButton onClick={() => performOperation("÷")}>
              ÷
            </CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(7)}>7</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(8)}>8</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(9)}>9</CalculatorButton>
            <CalculatorButton onClick={() => performOperation("×")}>
              ×
            </CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(4)}>4</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(5)}>5</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(6)}>6</CalculatorButton>
            <CalculatorButton onClick={() => performOperation("-")}>
              -
            </CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(1)}>1</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(2)}>2</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(3)}>3</CalculatorButton>
            <CalculatorButton onClick={() => performOperation("+")}>
              +
            </CalculatorButton>
            <CalculatorButton onClick={clearAll}>C</CalculatorButton>
            <CalculatorButton onClick={() => inputDigit(0)}>0</CalculatorButton>
            <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
            <CalculatorButton
              onClick={calculateResult}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              =
            </CalculatorButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}