import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, addMonths } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function App() {
  const [expenses, setExpenses] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newExpense, setNewExpense] = useState({ date: format(currentDate, 'yyyy-MM-dd'), amount: '', note: '' });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.note) {
      setExpenses(prev => ({
        ...prev,
        [newExpense.date]: [...(prev[newExpense.date] || []), { amount: parseFloat(newExpense.amount), note: newExpense.note }]
      }));
      setNewExpense({ date: newExpense.date, amount: '', note: '' });
    }
  };

  const totalForMonth = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    return eachDayOfInterval({ start, end }).reduce((total, day) => {
      const dayExpenses = expenses[format(day, 'yyyy-MM-dd')] || [];
      return total + dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    }, 0);
  };

  const currentMonthTotal = totalForMonth(currentDate);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
          <CardDescription>Track your expenses for {format(currentDate, 'MMMM yyyy')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={newExpense.date} 
                onChange={e => setNewExpense({...newExpense, date: e.target.value})} 
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="Enter amount"
                value={newExpense.amount}
                onChange={e => setNewExpense({...newExpense, amount: e.target.value})} 
              />
            </div>
            <div>
              <Label htmlFor="note">Note</Label>
              <Input 
                id="note" 
                placeholder="Enter a note"
                value={newExpense.note}
                onChange={e => setNewExpense({...newExpense, note: e.target.value})} 
              />
            </div>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </div>
        </CardContent>
        <CardFooter>
          <p>Total this month: ${currentMonthTotal.toFixed(2)}</p>
        </CardFooter>
      </Card>

      <Tabs defaultValue="current" className="mt-4 max-w-lg mx-auto">
        <TabsList>
          <TabsTrigger value="current">Current Month</TabsTrigger>
          <TabsTrigger value="previous">Previous Month</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          {daysInMonth.map(day => (
            <DailyExpense 
              key={day} 
              day={day} 
              expenses={expenses[format(day, 'yyyy-MM-dd')] || []} 
              total={totalForMonth}
            />
          ))}
        </TabsContent>
        <TabsContent value="previous">
          {eachDayOfInterval({
            start: startOfMonth(addMonths(currentDate, -1)),
            end: endOfMonth(addMonths(currentDate, -1))
          }).map(day => (
            <DailyExpense 
              key={day} 
              day={day} 
              expenses={expenses[format(day, 'yyyy-MM-dd')] || []} 
              total={totalForMonth}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DailyExpense({ day, expenses, total }) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{format(day, 'EEEE, MMM d')}</CardTitle>
        <CardDescription>
          Total: ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.map((exp, idx) => (
          <div key={idx} className="flex justify-between mb-2 last:mb-0">
            <span>{exp.note}</span>
            <span>${exp.amount.toFixed(2)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default App;