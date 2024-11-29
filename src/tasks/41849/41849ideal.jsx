import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
  dailyLogs: {},
};

export default function App() {
  const [state, setState] = useState(initialState);
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          elapsedTime: Date.now() - prevState.startTime + prevState.elapsedTime,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const startTimer = () => {
    setState((prevState) => ({
      ...prevState,
      isRunning: true,
      startTime: Date.now(),
    }));
  };

  const pauseTimer = () => {
    setState((prevState) => ({
      ...prevState,
      isRunning: false,
    }));
  };

  const stopTimer = () => {
    const now = new Date();
    const dateKey = now.toISOString().split("T")[0];
    const timeLog = {
      start: new Date(now.getTime() - state.elapsedTime).toLocaleTimeString(),
      end: now.toLocaleTimeString(),
      duration: state.elapsedTime,
    };

    setState((prevState) => ({
      ...prevState,
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      dailyLogs: {
        ...prevState.dailyLogs,
        [dateKey]: [...(prevState.dailyLogs[dateKey] || []), timeLog],
      },
    }));
  };

  const logManualTime = () => {
    if (manualDate && manualTime) {
      const [hours, minutes] = manualTime.split(":");
      const duration = (parseInt(hours) * 60 + parseInt(minutes)) * 60 * 1000;
      const timeLog = {
        start: manualTime,
        end: manualTime,
        duration: duration,
      };

      setState((prevState) => ({
        ...prevState,
        dailyLogs: {
          ...prevState.dailyLogs,
          [manualDate]: [...(prevState.dailyLogs[manualDate] || []), timeLog],
        },
      }));

      setManualDate("");
      setManualTime("");
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateTotalTime = (logs) => {
    return logs.reduce((total, log) => total + log.duration, 0);
  };

  const DailyView = () => (
    <div className="space-y-4">
      {Object.entries(state.dailyLogs).map(([date, logs]) => (
        <Card key={date} className="bg-white shadow-lg rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-semibold">{date}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {log.start} - {log.end}
                  </span>
                  <span className="text-blue-600">{formatTime(log.duration)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-lg font-bold text-blue-700">
              Total: {formatTime(calculateTotalTime(logs))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const WeeklyView = () => {
    const weeklyData = Object.entries(state.dailyLogs).reduce((acc, [date, logs]) => {
      const week = getWeekNumber(new Date(date));
      if (!acc[week]) acc[week] = {};
      acc[week][date] = calculateTotalTime(logs);
      return acc;
    }, {});

    return (
      <div className="space-y-4">
        {Object.entries(weeklyData).map(([week, days]) => (
          <Card key={week}>
            <CardHeader>
              <CardTitle>Week {week}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between space-x-2">
                {Object.entries(days).map(([date, duration]) => (
                  <div key={date} className="flex flex-col items-center">
                    <div className="h-32 w-8 bg-gray-200 relative">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-blue-500"
                        style={{ height: `${(duration / (8 * 60 * 60 * 1000)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-1">{new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className="text-xs">{formatTime(duration)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const MonthlyView = () => {
    const monthlyData = Object.entries(state.dailyLogs).reduce((acc, [date, logs]) => {
      const month = new Date(date).toLocaleString("default", { month: "long" });
      if (!acc[month]) acc[month] = 0;
      acc[month] += calculateTotalTime(logs);
      return acc;
    }, {});

    return (
      <div className="space-y-4">
        {Object.entries(monthlyData).map(([month, duration]) => (
          <Card key={month}>
            <CardHeader>
              <CardTitle>{month}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-16 w-full bg-gray-200 relative">
                <div
                  className="absolute top-0 left-0 bottom-0 bg-blue-500"
                  style={{ width: `${(duration / (160 * 60 * 60 * 1000)) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2 font-bold">{formatTime(duration)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        Time Tracker
      </h1>
      <Card className="mb-6 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md">
        <CardContent className="p-6 text-center">
          <div className="text-5xl font-bold text-blue-800 mb-4">
            {formatTime(state.elapsedTime)}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={startTimer}
              disabled={state.isRunning}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Start
            </Button>
            <Button
              onClick={pauseTimer}
              disabled={!state.isRunning}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
            >
              Pause
            </Button>
            <Button
              onClick={stopTimer}
              disabled={!state.isRunning && state.elapsedTime === 0}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
            >
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6 shadow-md">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Manual Time Log</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="time">Time (HH:MM)</Label>
              <Input
                type="time"
                id="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={logManualTime}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
            >
              Log Time
            </Button>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="daily" className="bg-white shadow-md rounded-lg">
        <TabsList className="flex justify-center mb-4 border-b">
          <TabsTrigger
            value="daily"
            className="px-6 py-2 text-gray-600 hover:text-blue-700"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="px-6 py-2 text-gray-600 hover:text-blue-700"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="px-6 py-2 text-gray-600 hover:text-blue-700"
          >
            Monthly
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <DailyView />
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyView />
        </TabsContent>
        <TabsContent value="monthly">
          <MonthlyView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
