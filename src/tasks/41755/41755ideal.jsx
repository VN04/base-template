import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const alarmSound = new Audio("data:audio/wav;base64,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");

function Alarm({ alarm, onStop, onSnooze, onDelete }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = alarm.time; // Time in HH:mm format
      const [hours, minutes] = timeString.split(":");

      // Extract the current date components
      const year = now.getFullYear();
      const month = now.getMonth(); // Months are 0-indexed
      const date = now.getDate();

      // Create the new date by combining the current date with the specified time
      const alarmTime = new Date(year, month, date, hours, minutes);
      const diff = alarmTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        alarmSound.play();
      } else {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarm]);

  return (
    <Card className="mb-4 shadow-md rounded-lg">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-lg font-semibold">{alarm.time}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600"><span className="font-bold text-blue-600">{timeLeft}</span></p>
        <div className="flex gap-2 mt-4">
          <Button onClick={onStop} className="bg-red-500 text-white">Stop</Button>
          <Button onClick={onSnooze} className="bg-yellow-500 text-white">Snooze</Button>
          <Button onClick={onDelete} variant="destructive" className="bg-gray-300">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleLap = () => setLaps((prevLaps) => [...prevLaps, time]);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-lg font-semibold">Stopwatch</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-mono mb-4 text-center">{formatTime(time)}</div>
        <div className="flex gap-2 mb-4 justify-center">
          {!isRunning ? (
            <Button onClick={handleStart} className="bg-green-500 text-white">Start</Button>
          ) : (
            <>
              <Button onClick={handleStop} className="bg-red-500 text-white">Stop</Button>
              <Button onClick={handleLap} className="bg-blue-500 text-white">Lap</Button>
            </>
          )}
          <Button onClick={handleReset} className="bg-gray-500 text-white">Reset</Button>
        </div>
        {laps.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Laps:</h3>
            <ul className="list-disc pl-5">
              {laps.map((lap, index) => (
                <li className="text-sm text-gray-700" key={index}>Lap {index + 1}: {formatTime(lap)}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [alarms, setAlarms] = useState([]);
  const [newAlarmTime, setNewAlarmTime] = useState("");

  const addAlarm = () => {
    if (newAlarmTime) {
      setAlarms([...alarms, { id: Date.now(), time: newAlarmTime }]);
      setNewAlarmTime("");
    }
  };

  const stopAlarm = (id) => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const snoozeAlarm = (id) => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    const alarm = alarms.find((a) => a.id === id);
    const timeString = alarm.time; // Time in HH:mm format
    const [hours, minutes] = timeString.split(":");

    // Extract the current date components
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // Months are 0-indexed
    const date = now.getDate();

    // Create the new date by combining the current date with the specified time
    const alarmTime = new Date(year, month, date, hours, minutes);
    const newTime = (alarmTime.getTime() + 5 * 60000);

    setAlarms(
      alarms.map((a) =>
        a.id === id ? { ...a, time: new Date(newTime).toLocaleTimeString() } : a
      )
    );
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-gray-50 rounded-md shadow-sm">
      <h1 className="text-2xl font-bold mb-4 text-center">Mobile Clock App</h1>
      <Tabs defaultValue="alarm">
        <TabsList className="flex justify-center">
          <TabsTrigger value="alarm" className="w-1/2 text-center">
            Alarm
          </TabsTrigger>
          <TabsTrigger value="stopwatch" className="w-1/2 text-center">
            Stopwatch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="alarm">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Set Alarm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={newAlarmTime}
                  className="flex-1"
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                />
                <Button onClick={addAlarm}>Add Alarm</Button>
              </div>
            </CardContent>
          </Card>
          {alarms.map((alarm) => (
            <Alarm
              key={alarm.id}
              alarm={alarm}
              onStop={() => stopAlarm(alarm.id)}
              onSnooze={() => snoozeAlarm(alarm.id)}
              onDelete={() => deleteAlarm(alarm.id)}
            />
          ))}
        </TabsContent>
        <TabsContent value="stopwatch">
          <Stopwatch />
        </TabsContent>
      </Tabs>
    </div>
  );
}