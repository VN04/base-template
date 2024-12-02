import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function App() {
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [newReminder, setNewReminder] = useState({ note: '', date: '', priority: 'Medium' });

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      setReminders(prev => 
        prev.map(r => {
          if (!r.completed && !r.overdue && new Date(r.date) < now) {
            alert(`Reminder: ${r.note}`);
            return { ...r, overdue: true };
          }
          return r;
        })
      );
    };
    const timer = setInterval(checkReminders, 1000);
    return () => clearInterval(timer);
  }, []);

  const addReminder = () => {
    if (newReminder.note && newReminder.date) {
      setReminders([...reminders, { ...newReminder, id: Date.now(), completed: false, overdue: false }]);
      setNewReminder({ note: '', date: '', priority: 'Medium' });
    }
  };

  const updateReminder = (id, updatedFields) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const completeReminder = (id) => {
    updateReminder(id, { completed: true, overdue: false });
  };

  const snoozeReminder = (id) => {
    updateReminder(id, { overdue: true });
  };

  const filteredReminders = reminders.filter(reminder => {
    switch (activeTab) {
      case 'active': return !reminder.completed && !reminder.overdue;
      case 'done': return reminder.completed;
      case 'overdue': return reminder.overdue;
      default: return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Reminder App</h1>
      
      <Tabs defaultValue="active" className="w-full max-w-lg mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Input id="note" value={newReminder.note} onChange={e => setNewReminder({...newReminder, note: e.target.value})} />
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" type="datetime-local" value={newReminder.date} onChange={e => setNewReminder({...newReminder, date: e.target.value})} />
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={value => setNewReminder({...newReminder, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={newReminder.priority} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addReminder}>Add Reminder</Button>
              </div>
            </CardContent>
          </Card>
          
          {filteredReminders.map(reminder => (
            <TabsContent value={activeTab} key={reminder.id}>
              <ReminderCard 
                reminder={reminder} 
                onComplete={completeReminder} 
                onSnooze={snoozeReminder}
                onUpdate={(fields) => updateReminder(reminder.id, fields)}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

function ReminderCard({ reminder, onComplete, onSnooze, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editReminder, setEditReminder] = useState(reminder);

  const priorityColor = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  return (
    <Card className={`mb-4 ${priorityColor[reminder.priority]}`}>
      <CardHeader>
        <CardTitle>{isEditing ? (
          <Input value={editReminder.note} onChange={e => setEditReminder({...editReminder, note: e.target.value})} />
        ) : reminder.note}</CardTitle>
        <CardDescription>{reminder.date}</CardDescription>
      </CardHeader>
      <CardContent>
        {!reminder.completed && !reminder.overdue && (
          <div>
            <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
            {isEditing ? (
              <Button onClick={() => { onUpdate(editReminder); setIsEditing(false); }}>Save</Button>
            ) : (
              <Button onClick={() => onComplete(reminder.id)}>Complete</Button>
            )}
            <Button onClick={() => onSnooze(reminder.id)} variant="outline">Snooze</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default App;