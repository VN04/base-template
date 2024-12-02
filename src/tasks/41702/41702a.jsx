import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const priorityColors = {
  High: "bg-red-200",
  Medium: "bg-yellow-200",
  Low: "bg-green-200",
};

function ReminderForm({ onSubmit, initialValues = {} }) {
  const [note, setNote] = useState(initialValues.note || "");
  const [dateTime, setDateTime] = useState(initialValues.dateTime || "");
  const [priority, setPriority] = useState(initialValues.priority || "Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ note, dateTime, priority });
    setNote("");
    setDateTime("");
    setPriority("Medium");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="note">Note</Label>
        <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="dateTime">Date and Time</Label>
        <Input id="dateTime" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{initialValues.id ? "Update" : "Create"} Reminder</Button>
    </form>
  );
}

function ReminderCard({ reminder, onComplete, onEdit }) {
  return (
    <Card className={`mb-4 ${priorityColors[reminder.priority]}`}>
      <CardHeader>
        <CardTitle>{reminder.note}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Due: {new Date(reminder.dateTime).toLocaleString()}</p>
        <p>Priority: {reminder.priority}</p>
        <div className="mt-4 space-x-2">
          <Button onClick={() => onComplete(reminder.id)}>Complete</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Reminder</DialogTitle>
              </DialogHeader>
              <ReminderForm onSubmit={(data) => onEdit(reminder.id, data)} initialValues={reminder} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach((reminder) => {
        if (reminder.status === "active" && new Date(reminder.dateTime) <= now) {
          if (window.confirm(`Reminder: ${reminder.note}\nComplete this reminder?`)) {
            handleComplete(reminder.id);
          } else {
            handleSnooze(reminder.id);
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [reminders]);

  const addReminder = (data) => {
    const newReminder = { ...data, id: Date.now(), status: "active" };
    setReminders([...reminders, newReminder]);
  };

  const handleComplete = (id) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, status: "done" } : r)));
  };

  const handleSnooze = (id) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, status: "overdue" } : r)));
  };

  const handleEdit = (id, data) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const filteredReminders = reminders.filter((r) => r.status === activeTab);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Reminder App</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-6">Create New Reminder</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Reminder</DialogTitle>
          </DialogHeader>
          <ReminderForm onSubmit={addReminder} />
        </DialogContent>
      </Dialog>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onComplete={handleComplete} onEdit={handleEdit} />
          ))}
        </TabsContent>
        <TabsContent value="done">
          {filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onComplete={handleComplete} onEdit={handleEdit} />
          ))}
        </TabsContent>
        <TabsContent value="overdue">
          {filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onComplete={handleComplete} onEdit={handleEdit} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}