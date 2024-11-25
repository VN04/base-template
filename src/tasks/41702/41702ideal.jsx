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

function ReminderForm({ addReminder, closeDialog }) {
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
      closeDialog(); // Automatically close dialog upon successful creation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Reminder title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
      />
      <Textarea
        placeholder="Notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
      />
      <Input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
      />
      <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-md hover:from-green-500 hover:to-green-700">
        Add Reminder
      </Button>
    </form>
  );
}

function ReminderCard({ reminder, onComplete, onIgnore }) {
  return (
    <Card className="mb-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{reminder.title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{new Date(reminder.time).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{reminder.note}</p>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {reminder.status === "active" && (
          <>
            <Button onClick={() => onComplete(reminder.id)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4">
              Complete
            </Button>
            <Button variant="outline" onClick={() => onIgnore(reminder.id)} className="border rounded-lg px-4">
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
    <Alert className="mb-4 border rounded-lg shadow-md p-4 bg-red-100">
      <AlertTitle className="font-bold text-red-600">{reminder.title}</AlertTitle>
      <AlertDescription className="text-gray-700">{reminder.note}</AlertDescription>
      <div className="mt-4 space-x-2">
        <Button onClick={() => { onComplete(reminder.id); onClose(); }} className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4">
          Complete
        </Button>
        <Button variant="outline" onClick={() => { onIgnore(reminder.id); onClose(); }} className="border rounded-lg px-4">
          Ignore
        </Button>
      </div>
    </Alert>
  );
}

export default function App() {
  const [reminders, setReminders] = useState([]);
  const [alertReminder, setAlertReminder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state

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
    <div className="container mx-auto p-6 max-w-3xl bg-gradient-to-r from-indigo-100 to-purple-200 rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Reminder App
      </h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600">
            Create New Reminder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create a New Reminder</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Fill in the details for your new reminder.
            </DialogDescription>
          </DialogHeader>
          <ReminderForm addReminder={addReminder} closeDialog={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg">
          <TabsTrigger value="active" className="font-semibold hover:bg-gray-200">
            Active
          </TabsTrigger>
          <TabsTrigger value="done" className="font-semibold hover:bg-gray-200">
            Done
          </TabsTrigger>
          <TabsTrigger value="overdue" className="font-semibold hover:bg-gray-200">
            Overdue
          </TabsTrigger>
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
