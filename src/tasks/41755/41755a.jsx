import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

function App() {
  const [mode, setMode] = useState('alarm');
  const [alarms, setAlarms] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stopwatch, setStopwatch] = useState({ running: false, time: 0, laps: [] });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const checkAlarms = () => {
    const now = currentTime.toTimeString().split(' ')[0];
    alarms.forEach((alarm, index) => {
      if (alarm.time === now && !alarm.snoozed) {
        setAlarms(prev => 
          prev.map((a, i) => i === index ? { ...a, ringing: true } : a)
        );
      }
    });
  };

  useEffect(checkAlarms, [currentTime]);

  const formatTime = (time) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const hours = Math.floor((time % 86400000) / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  };

  const addAlarm = (time) => {
    setAlarms(prev => [...prev, { time, ringing: false, snoozed: false }]);
  };

  const handleAlarmAction = (index, action) => {
    if (action === 'stop') {
      setAlarms(prev => prev.map((a, i) => i === index ? { ...a, ringing: false } : a));
    } else if (action === 'snooze') {
      const newTime = new Date(currentTime.getTime() + 5 * 60000);
      setAlarms(prev => 
        prev.map((a, i) => 
          i === index ? { ...a, time: newTime.toTimeString().split(' ')[0], ringing: false, snoozed: true } : a
        )
      );
    }
  };

  const startStopwatch = () => {
    if (!stopwatch.running) {
      setStopwatch(prev => ({ ...prev, running: true, start: Date.now() - prev.time }));
    } else {
      setStopwatch(prev => ({ ...prev, running: false }));
    }
  };

  const lapStopwatch = () => {
    if (stopwatch.running) {
      setStopwatch(prev => ({ ...prev, laps: [...prev.laps, prev.time] }));
    }
  };

  const resetStopwatch = () => {
    setStopwatch({ running: false, time: 0, laps: [] });
  };

  useEffect(() => {
    let interval;
    if (stopwatch.running) {
      interval = setInterval(() => {
        setStopwatch(prev => ({ ...prev, time: Date.now() - stopwatch.start }));
      }, 10);
    } else if (!stopwatch.running && stopwatch.time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatch.running]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mb-4">
        <Button variant={mode === 'alarm' ? "default" : "outline"} onClick={() => setMode('alarm')}>Alarm</Button>
        <Button variant={mode === 'stopwatch' ? "default" : "outline"} onClick={() => setMode('stopwatch')}>Stopwatch</Button>
      </div>

      {mode === 'alarm' && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Set Alarm</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="time" onChange={(e) => addAlarm(e.target.value)} />
            {alarms.map((alarm, i) => (
              <div key={i} className="flex items-center justify-between mt-2">
                <span>{alarm.time}</span>
                {alarm.ringing && (
                  <>
                    <Button onClick={() => handleAlarmAction(i, 'stop')}>Stop</Button>
                    <Button onClick={() => handleAlarmAction(i, 'snooze')}>Snooze</Button>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {mode === 'stopwatch' && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Stopwatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-4">{formatTime(stopwatch.time)}</div>
            <div className="flex justify-between">
              <Button onClick={startStopwatch}>{stopwatch.running ? 'Stop' : 'Start'}</Button>
              <Button onClick={lapStopwatch} disabled={!stopwatch.running}>Lap</Button>
              <Button onClick={resetStopwatch}>Reset</Button>
            </div>
            {stopwatch.laps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Laps:</h3>
                {stopwatch.laps.map((lap, idx) => (
                  <div key={idx}>{formatTime(lap)}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;