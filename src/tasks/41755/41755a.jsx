import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const formatTime = (time) => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(3, "0")}`;
};

const Alarm = () => {
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAlarmSet && !isAlarmRinging) {
      const [hours, minutes] = alarmTime.split(":");
      if (
        currentTime.getHours() === parseInt(hours) &&
        currentTime.getMinutes() === parseInt(minutes) &&
        currentTime.getSeconds() === 0
      ) {
        setIsAlarmRinging(true);
      }
    }
  }, [currentTime, alarmTime, isAlarmSet, isAlarmRinging]);

  const handleSetAlarm = () => {
    setIsAlarmSet(true);
  };

  const handleStopAlarm = () => {
    setIsAlarmRinging(false);
    setIsAlarmSet(false);
  };

  const handleSnoozeAlarm = () => {
    setIsAlarmRinging(false);
    const snoozeTime = new Date(currentTime.getTime() + 5 * 60000);
    setAlarmTime(
      `${snoozeTime.getHours().toString().padStart(2, "0")}:${snoozeTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Alarm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <Input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="w-full"
          />
          {!isAlarmSet && (
            <Button onClick={handleSetAlarm} className="w-full">
              Set Alarm
            </Button>
          )}
          {isAlarmRinging && (
            <div className="space-y-2 w-full">
              <div className="text-center text-red-500 font-bold">
                Alarm Ringing!
              </div>
              <Button onClick={handleStopAlarm} className="w-full">
                Stop
              </Button>
              <Button onClick={handleSnoozeAlarm} className="w-full">
                Snooze (5 min)
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, time]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stopwatch</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-4xl font-bold">{formatTime(time)}</div>
          <div className="flex space-x-2">
            {!isRunning ? (
              <Button onClick={handleStart}>Start</Button>
            ) : (
              <>
                <Button onClick={handleLap}>Lap</Button>
                <Button onClick={handleStop}>Stop</Button>
              </>
            )}
            <Button onClick={handleReset}>Reset</Button>
          </div>
          {laps.length > 0 && (
            <div className="w-full">
              <h3 className="font-bold mb-2">Laps:</h3>
              <ul className="space-y-1">
                {laps.map((lap, index) => (
                  <li key={index}>Lap {index + 1}: {formatTime(lap)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="alarm" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alarm">Alarm</TabsTrigger>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          </TabsList>
          <TabsContent value="alarm">
            <Alarm />
          </TabsContent>
          <TabsContent value="stopwatch">
            <Stopwatch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}