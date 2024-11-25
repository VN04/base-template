import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ReminderForm({ addReminder }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && time) {
      addReminder({ title, note, time, status: "active" });
      setTitle("");
      setNote("");
      setTime("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <Button type="submit">Add Reminder</Button>
    </form>
  );
}

function ReminderCard({ reminder, onComplete, onIgnore }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{reminder.title}</CardTitle>
        <CardDescription>{new Date(reminder.time).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{reminder.note}</p>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {reminder.status === "active" && (
          <>
            <Button onClick={() => onComplete(reminder.id)}>Complete</Button>
            <Button variant="outline" onClick={() => onIgnore(reminder.id)}>
              Ignore
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function ReminderList({ reminders, onComplete, onIgnore }) {
  return (
    <div>
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onComplete={onComplete}
          onIgnore={onIgnore}
        />
      ))}
    </div>
  );
}

function ReminderAlert({ reminder, onComplete, onIgnore, onClose }) {
  return (
    <Alert className="mb-4">
      <AlertTitle>{reminder.title}</AlertTitle>
      <AlertDescription>{reminder.note}</AlertDescription>
      <div className="mt-4 space-x-2">
        <Button onClick={() => { onComplete(reminder.id); onClose(); }}>
          Complete
        </Button>
        <Button variant="outline" onClick={() => { onIgnore(reminder.id); onClose(); }}>
          Ignore
        </Button>
      </div>
    </Alert>
  );
}

export default function App() {
  const [reminders, setReminders] = useState([]);
  const [alertReminder, setAlertReminder] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const activeReminder = reminders.find(
        (r) => r.status === "active" && new Date(r.time) <= now
      );
      if (activeReminder) {
        setAlertReminder(activeReminder);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  const addReminder = (reminder) => {
    setReminders([...reminders, { ...reminder, id: Date.now() }]);
  };

  const updateReminderStatus = (id, status) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const completeReminder = (id) => updateReminderStatus(id, "done");
  const ignoreReminder = (id) => updateReminderStatus(id, "overdue");

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Reminder App</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-8 w-full">Create New Reminder</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new reminder</DialogTitle>
            <DialogDescription>
              Fill in the details for your new reminder.
            </DialogDescription>
          </DialogHeader>
          <ReminderForm addReminder={addReminder} />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ReminderList
            reminders={reminders.filter((r) => r.status === "active")}
            onComplete={completeReminder}
            onIgnore={ignoreReminder}
          />
        </TabsContent>
        <TabsContent value="done">
          <ReminderList
            reminders={reminders.filter((r) => r.status === "done")}
            onComplete={completeReminder}
            onIgnore={ignoreReminder}
          />
        </TabsContent>
        <TabsContent value="overdue">
          <ReminderList
            reminders={reminders.filter((r) => r.status === "overdue")}
            onComplete={completeReminder}
            onIgnore={ignoreReminder}
          />
        </TabsContent>
      </Tabs>

      {alertReminder && (
        <Dialog open={true} onOpenChange={() => setAlertReminder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reminder Alert</DialogTitle>
            </DialogHeader>
            <ReminderAlert
              reminder={alertReminder}
              onComplete={completeReminder}
              onIgnore={ignoreReminder}
              onClose={() => setAlertReminder(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}