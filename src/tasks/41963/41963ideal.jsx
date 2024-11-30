import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const doctors = [
  { id: 1, name: "Dr. Smith", specialty: "Cardiologist" },
  { id: 2, name: "Dr. Johnson", specialty: "Pediatrician" },
  { id: 3, name: "Dr. Williams", specialty: "Dermatologist" },
];

// Generate slots dynamically for the next 3 days
const generateAvailableSlots = () => {
  const slots = {};
  const times = [];
  for (let i = 9; i <= 16; i++) {
    times.push(`${i}:00`, `${i}:30`);
  }

  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];
    slots[dateKey] = times.map((time) => ({ time, available: true }));
  }

  return slots;
};

const DoctorCard = ({ doctor, onSelect }) => (
  <Card
    className="cursor-pointer hover:shadow-lg transition-shadow"
    onClick={() => onSelect(doctor)}
  >
    <CardHeader>
      <CardTitle>{doctor.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{doctor.specialty}</p>
    </CardContent>
  </Card>
);

const AppointmentSlot = ({ date, slot, onBook }) => (
  <Button
    variant={slot.available ? "outline" : "ghost"}
    className={`w-full ${
      slot.available
        ? "hover:bg-primary hover:text-primary-foreground"
        : "opacity-50 cursor-not-allowed"
    }`}
    onClick={() => slot.available && onBook(date, slot.time)}
    disabled={!slot.available}
  >
    {slot.time}
  </Button>
);

const AppointmentDialog = ({ doctor, slots, isOpen, onClose, onBook }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Book Appointment with {doctor?.name}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="mt-4 h-[300px] pr-4">
        {Object.entries(slots).map(([date, daySlots]) => (
          <div key={date} className="mb-4">
            <h3 className="font-semibold mb-2">{new Date(date).toDateString()}</h3>
            <div className="grid grid-cols-2 gap-2">
              {daySlots.map((slot, index) => (
                <AppointmentSlot key={index} date={date} slot={slot} onBook={onBook} />
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

const ConfirmationDialog = ({ isOpen, onClose, appointmentDetails }) => {
  if (!appointmentDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Appointment Confirmed</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>Your appointment has been booked with {appointmentDetails.doctor}.</p>
          <p>Date: {appointmentDetails.date}</p>
          <p>Time: {appointmentDetails.time}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Back to Dashboard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // Generate individual slots for each doctor
  const [doctorSlots, setDoctorSlots] = useState(() =>
    doctors.reduce((acc, doctor) => {
      acc[doctor.id] = generateAvailableSlots();
      return acc;
    }, {})
  );

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setIsAppointmentDialogOpen(true);
  };

  const handleBookAppointment = (date, time) => {
    const updatedSlots = { ...doctorSlots };
    const slotsForDoctor = updatedSlots[selectedDoctor.id];
    slotsForDoctor[date] = slotsForDoctor[date].map((slot) =>
      slot.time === time ? { ...slot, available: false } : slot
    );

    setDoctorSlots(updatedSlots);

    setAppointmentDetails({
      doctor: selectedDoctor.name,
      date: new Date(date).toDateString(),
      time,
    });

    setIsAppointmentDialogOpen(false);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationDialogOpen(false);
    setSelectedDoctor(null);
    setAppointmentDetails(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Doctor Appointment Scheduler
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onSelect={handleDoctorSelect} />
        ))}
      </div>
      {selectedDoctor && (
        <AppointmentDialog
          doctor={selectedDoctor}
          slots={doctorSlots[selectedDoctor.id]}
          isOpen={isAppointmentDialogOpen}
          onClose={() => setIsAppointmentDialogOpen(false)}
          onBook={handleBookAppointment}
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onClose={handleConfirmationClose}
        appointmentDetails={appointmentDetails}
      />
    </div>
  );
}
