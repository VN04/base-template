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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && note) {
      addExpense({ amount: parseFloat(amount), note, date: new Date() });
      setAmount("");
      setNote("");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
            />
          </div>
          <Button type="submit">Add Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ExpenseList({ expenses }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense List</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {expenses.map((expense, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{expense.note}</span>
              <span className="font-bold">${expense.amount.toFixed(2)}</span>
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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Monthly Total</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${total.toFixed(2)}</p>
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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Expense Tracker</h1>
      <ExpenseForm addExpense={addExpense} />
      <Select
        value={selectedMonth.toString()}
        onValueChange={(value) => setSelectedMonth(parseInt(value))}
      >
        <SelectTrigger className="w-full mb-6">
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
      <ExpenseList expenses={expenses.filter((expense) => expense.date.getMonth() === selectedMonth)} />
      <MonthlyTotal expenses={expenses} selectedMonth={selectedMonth} />
    </div>
  );
}