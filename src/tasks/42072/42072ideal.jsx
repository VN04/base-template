import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ExpenseForm({ addExpense }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && note && date) {
      addExpense({
        amount: parseFloat(amount),
        note,
        date: new Date(date),
      });
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <Card className="mb-6 shadow-lg hover:shadow-2xl transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="font-medium text-gray-600">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="note" className="font-medium text-gray-600">
              Note
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
              className="mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="date" className="font-medium text-gray-600">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg py-2 mt-4 shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ExpenseList({ expenses }) {
  return (
    <Card className="shadow-lg hover:shadow-2xl transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Expense List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {expenses.map((expense, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="text-gray-700">
                {expense.note} -{" "}
                <span className="text-sm text-gray-500">
                  {expense.date.toLocaleDateString()}
                </span>
              </span>
              <span className="font-bold text-blue-500">
                ${expense.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function MonthlyTotal({ expenses, selectedMonth }) {
  const total = expenses
    .filter((expense) => expense.date.getMonth() === selectedMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="mt-6 shadow-lg hover:shadow-2xl transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Monthly Total
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-green-500">${total.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Expense Tracker
      </h1>
      <ExpenseForm addExpense={addExpense} />
      <Select
        value={selectedMonth.toString()}
        onValueChange={(value) => setSelectedMonth(parseInt(value))}
      >
        <SelectTrigger className="w-full mb-6 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ExpenseList
        expenses={expenses.filter(
          (expense) => expense.date.getMonth() === selectedMonth
        )}
      />
      <MonthlyTotal expenses={expenses} selectedMonth={selectedMonth} />
    </div>
  );
}
