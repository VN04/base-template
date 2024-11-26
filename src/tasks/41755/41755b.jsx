import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

function App() {
  const [mode, setMode] = useState('alarm');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmActive, setAlarmActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (alarmActive && new Date(alarmTime).getTime() <= currentTime.getTime()) {
      alert('Alarm Ringing!');
      setAlarmActive(false);
    }
  }, [currentTime, alarmTime, alarmActive]);

  const startStopwatch = useCallback(() => {
    if (!isStopwatchRunning) {
      const startTime = Date.now() - stopwatchTime;
      const interval = setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 10);
      setIsStopwatchRunning(interval);
    } else {
      clearInterval(isStopwatchRunning);
      setIsStopwatchRunning(false);
    }
  }, [isStopwatchRunning, stopwatchTime]);

  const handleLap = () => {
    if (isStopwatchRunning) {
      setLaps(prevLaps => [...prevLaps, stopwatchTime]);
    }
  };

  const formatTime = (timeMs) => {
    const pad = (num, size) => `000${num}`.slice(-size);
    let ms = timeMs % 1000;
    let seconds = Math.floor((timeMs / 1000) % 60);
    let minutes = Math.floor((timeMs / (1000 * 60)) % 60);
    let hours = Math.floor(timeMs / (1000 * 60 * 60));

    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(ms, 3).slice(0, 2)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="sm:w-[320px] w-full p-4">
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'alarm' ? 'Alarm Clock' : 'Stopwatch'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-around">
              <Button variant={mode === 'alarm' ? 'default' : 'outline'} onClick={() => setMode('alarm')}>Alarm</Button>
              <Button variant={mode === 'stopwatch' ? 'default' : 'outline'} onClick={() => setMode('stopwatch')}>Stopwatch</Button>
            </div>

            {mode === 'alarm' && (
              <>
                <Input 
                  type="datetime-local" 
                  value={alarmTime} 
                  onChange={(e) => setAlarmTime(e.target.value)} 
                />
                <Switch 
                  checked={alarmActive} 
                  onCheckedChange={setAlarmActive} 
                  className="mt-4"
                />
                {alarmActive && (
                  <div className="flex justify-around mt-4">
                    <Button onClick={() => setAlarmActive(false)}>Stop</Button>
                    <Button onClick={() => setAlarmTime(new Date(Date.now() + 5 * 60000).toISOString().slice(0,-8))}>Snooze 5 min</Button>
                  </div>
                )}
              </>
            )}

            {mode === 'stopwatch' && (
              <>
                <div className="text-4xl text-center mb-4">{formatTime(stopwatchTime)}</div>
                <div className="flex justify-around">
                  <Button onClick={startStopwatch}>{isStopwatchRunning ? 'Stop' : 'Start'}</Button>
                  <Button onClick={handleLap} disabled={!isStopwatchRunning}>Lap</Button>
                </div>
                {laps.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold">Laps:</h3>
                    <ul>
                      {laps.map((lap, index) => (
                        <li key={index}>{formatTime(lap)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;