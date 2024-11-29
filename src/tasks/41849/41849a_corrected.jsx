import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

function App() {
  const [timer, setTimer] = useState({ running: false, start: null, current: null });
  const [loggedTimes, setLoggedTimes] = useState([]);
  const [manualEntry, setManualEntry] = useState({ date: '', start: '', end: '' });
  const [view, setView] = useState('daily');

  useEffect(() => {
    let interval;
    if (timer.running) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, current: new Date() }));
      }, 1000);
    } else if (!timer.running && timer.current !== null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer.running]);

  const startTimer = () => {
    setTimer({ running: true, start: new Date(), current: new Date() });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, running: false }));
  };

  const stopTimer = () => {
    const endTime = new Date();
    setLoggedTimes(prev => [...prev, { start: timer.start, end: endTime }]);
    setTimer({ running: false, start: null, current: null });
  };

  const handleManualEntry = (e) => {
    const { name, value } = e.target;
    setManualEntry(prev => ({ ...prev, [name]: value }));
  };

  const addManualEntry = () => {
    const start = new Date(`${manualEntry.date}T${manualEntry.start}`);
    const end = new Date(`${manualEntry.date}T${manualEntry.end}`);
    if (start < end) {
      setLoggedTimes(prev => [...prev, { start, end }]);
      setManualEntry({ date: '', start: '', end: '' });
    }
  };

  const timeWorked = (start, end) => {
    const diff = (end - start) / 1000;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const renderDailyView = () => {
    return loggedTimes.map((log, idx) => (
      <div key={idx} className="mb-2">
        {format(log.start, 'hh:mm a')} - {format(log.end, 'hh:mm a')}: {timeWorked(log.start, log.end)}
      </div>
    ));
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const dailyHours = days.map(day => {
      const logs = loggedTimes.filter(log => 
        log.start.toDateString() === day.toDateString()
      );
      const total = logs.reduce((sum, log) => sum + (log.end - log.start), 0);
      return { day, hours: total / 3600000 }; // Convert to hours
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {dailyHours.map((data, idx) => (
          <div key={idx} className="text-center">
            {format(data.day, 'EEE')}<br/>
            {data.hours.toFixed(1)}h
          </div>
        ))}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const weeks = [];
    let weekStart = startOfWeek(new Date());
    for (let i = 0; i < 4; i++) {
      const weekEnd = endOfWeek(weekStart);
      const weeklyHours = loggedTimes.reduce((sum, log) => {
        if (log.start >= weekStart && log.start <= weekEnd) {
          return sum + (log.end - log.start);
        }
        return sum;
      }, 0) / 3600000;
      weeks.push({ start: weekStart, hours: weeklyHours });
      weekStart = addDays(weekEnd, 1);
    }

    return (
      <div className="flex flex-col space-y-2">
        {weeks.map((week, idx) => (
          <div key={idx} className="flex items-center">
            Week {idx + 1}: {week.hours.toFixed(1)}h
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!timer.running ? (
            <Button onClick={startTimer}>Start</Button>
          ) : (
            <>
              <Button onClick={pauseTimer}>Pause</Button>
              <Button onClick={stopTimer}>Stop</Button>
            </>
          )}
          <div>
            {timer.start && `Timer: ${format(timer.current, 'HH:mm:ss')}`}
          </div>
          <div className="space-y-2">
            <Input 
              type="date" 
              name="date" 
              value={manualEntry.date} 
              onChange={handleManualEntry} 
              placeholder="Date"
            />
            <div className="flex space-x-2">
              <Input 
                type="time" 
                name="start" 
                value={manualEntry.start} 
                onChange={handleManualEntry} 
                placeholder="Start Time"
              />
              <Input 
                type="time" 
                name="end" 
                value={manualEntry.end} 
                onChange={handleManualEntry} 
                placeholder="End Time"
              />
            </div>
            <Button onClick={addManualEntry}>Add Manual Entry</Button>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setView('daily')}>Daily</Button>
            <Button onClick={() => setView('weekly')}>Weekly</Button>
            <Button onClick={() => setView('monthly')}>Monthly</Button>
          </div>
          {view === 'daily' && renderDailyView()}
          {view === 'weekly' && renderWeeklyView()}
          {view === 'monthly' && renderMonthlyView()}
        </CardContent>
        <CardFooter>
          <p>Total Work: {loggedTimes.reduce((sum, log) => sum + (log.end - log.start), 0) / 3600000} hours</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;