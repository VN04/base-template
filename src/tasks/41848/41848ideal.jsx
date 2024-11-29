import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function CalendarHeader({ date, onNext, onPrev, view, setView }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        onClick={onPrev}
        disabled={
          (view === "year" && date.getFullYear() === new Date().getFullYear()) ||
          (date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth())
        }
        className="px-4 py-2"
      >
        Prev
      </Button>
      <h2 className="text-2xl font-semibold">
        {view === "year" ? date.getFullYear() : `${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
      </h2>
      <Button onClick={onNext} className="px-4 py-2">
        Next
      </Button>
      <Select value={view} onValueChange={setView}>
        <SelectTrigger className="w-40 ml-4">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function DayView({ date, reminders, addReminder }) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{date.toDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {reminders[date.toDateString()]?.map((reminder, index) => (
            <li key={index}>{reminder}</li>
          ))}
        </ul>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">Add Reminder</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Reminder</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter reminder"
              className="mt-2"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addReminder(date, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function MonthView({ year, month, reminders, addReminder }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {DAYS.map((day) => (
        <div key={day} className="font-semibold text-gray-600">
          {day}
        </div>
      ))}
      {Array(firstDay).fill(null).map((_, index) => (
        <div key={`empty-${index}`} />
      ))}
      {Array(daysInMonth)
        .fill(null)
        .map((_, index) => {
          const day = index + 1;
          const currentDate = new Date(year, month, day);
          const dateString = currentDate.toDateString();
          return (
            <Dialog key={day}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-20 flex flex-col justify-center items-center ${
                    currentDate.toDateString() === new Date().toDateString() ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  <span>{day}</span>
                  {reminders[dateString] && (
                    <span className="text-xs text-blue-500">
                      {reminders[dateString].length}<br></br> reminder(s)
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dateString}</DialogTitle>
                </DialogHeader>
                <DayView date={currentDate} reminders={reminders} addReminder={addReminder} />
              </DialogContent>
            </Dialog>
          );
        })}
    </div>
  );
}

function YearView({ year, setDate, setView }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {MONTHS.map((month, index) => (
        <Button
          key={month}
          variant="outline"
          className="h-24 flex flex-col items-center justify-center hover:bg-gray-100"
          onClick={() => {
            setDate(new Date(year, index, 1));
            setView("month");
          }}
        >
          <span className="text-lg font-bold">{month}</span>
          <span className="text-sm text-gray-500">{year}</span>
        </Button>
      ))}
    </div>
  );
}

export default function App() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [reminders, setReminders] = useState({});

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() > currentYear + 5) {
      setDate(new Date(currentYear + 5, 0, 1));
    }
  }, [date]);

  const addReminder = (date, reminder) => {
    const dateString = date.toDateString();
    setReminders((prev) => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), reminder],
    }));
  };

  const handleNext = () => {
    if (view === "day") {
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
    } else if (view === "month") {
      setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    } else {
      setDate(new Date(date.getFullYear() + 1, 0, 1));
    }
  };

  const handlePrev = () => {
    if (view === "day") {
      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
    } else if (view === "month") {
      setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    } else {
      setDate(new Date(date.getFullYear() - 1, 0, 1));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md sm:max-w-xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Responsive Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarHeader
            date={date}
            onNext={handleNext}
            onPrev={handlePrev}
            view={view}
            setView={setView}
          />
          {view === "day" && (
            <DayView date={date} reminders={reminders} addReminder={addReminder} />
          )}
          {view === "month" && (
            <MonthView
              year={date.getFullYear()}
              month={date.getMonth()}
              reminders={reminders}
              addReminder={addReminder}
            />
          )}
          {view === "year" && (
            <YearView year={date.getFullYear()} setDate={setDate} setView={setView} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
