import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function App() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ note: '', time: '' });
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder, index) => {
        const reminderTime = new Date(reminder.time);
        if (!reminder.completed && reminderTime <= now && !reminder.snoozed) {
          setAlert({ ...reminder, index });
        }
      });
    };

    const timer = setInterval(checkReminders, 1000);
    return () => clearInterval(timer);
  }, [reminders]);

  const addReminder = () => {
    if (newReminder.note && newReminder.time) {
      setReminders([...reminders, { ...newReminder, completed: false, snoozed: false }]);
      setNewReminder({ note: '', time: '' });
    }
  };

  const handleAlertAction = (action) => {
    const updatedReminders = [...reminders];
    if (action === 'complete') {
      updatedReminders[alert.index].completed = true;
    } else {
      updatedReminders[alert.index].snoozed = true;
    }
    setReminders(updatedReminders);
    setAlert(null);
  };

  const ReminderCard = ({ reminder, status }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{reminder.note}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Time: {new Date(reminder.time).toLocaleString()}</p>
        <p>Status: {status}</p>
      </CardContent>
      {status === 'Active' && (
        <CardFooter>
          <Button onClick={() => {
            const updated = [...reminders];
            updated[reminders.indexOf(reminder)].completed = true;
            setReminders(updated);
          }}>Mark as Done</Button>
        </CardFooter>
      )}
    </Card>
  );

  const filteredReminders = {
    active: reminders.filter(r => !r.completed && !r.snoozed),
    done: reminders.filter(r => r.completed),
    overdue: reminders.filter(r => r.snoozed && !r.completed),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Reminder App</h1>
        <div className="mb-4">
          <Label htmlFor="note">Note</Label>
          <Input 
            id="note" 
            value={newReminder.note} 
            onChange={(e) => setNewReminder({...newReminder, note: e.target.value})} 
            placeholder="Reminder note" 
            className="mb-2"
          />
          <Label htmlFor="time">Time</Label>
          <Input 
            id="time" 
            type="datetime-local" 
            value={newReminder.time} 
            onChange={(e) => setNewReminder({...newReminder, time: e.target.value})} 
            className="mb-2"
          />
          <Button onClick={addReminder}>Add Reminder</Button>
        </div>

        {alert && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">Reminder: </strong>
            <span>{alert.note}</span>
            <div className="mt-2">
              <Button onClick={() => handleAlertAction('complete')} className="mr-2">Complete</Button>
              <Button onClick={() => handleAlertAction('ignore')}>Ignore</Button>
            </div>
          </div>
        )}

        {['Active', 'Done', 'Overdue'].map(section => (
          <div key={section} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section} Reminders</h2>
            {filteredReminders[section.toLowerCase()].length === 0 ? (
              <p>No reminders here.</p>
            ) : (
              filteredReminders[section.toLowerCase()].map((reminder, idx) => (
                <ReminderCard key={idx} reminder={reminder} status={section} />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;