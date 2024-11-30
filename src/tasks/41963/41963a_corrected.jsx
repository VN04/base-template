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

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 17; i++) {
    slots.push(`${i}:00`);
    if (i !== 17) slots.push(`${i}:30`);
  }
  return slots;
};

const generateAvailableSlots = () => {
  const availableSlots = {};
  const timeSlots = generateTimeSlots();

  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    availableSlots[dateString] = timeSlots.map(time => ({ time, available: Math.random() > 0.3 }));
  }

  return availableSlots;
};

const DoctorCard = ({ doctor, onSelect }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect(doctor)}>
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
    className={`w-full ${slot.available ? "hover:bg-primary hover:text-primary-foreground" : "opacity-50 cursor-not-allowed"}`}
    onClick={() => slot.available && onBook(date, slot.time)}
    disabled={!slot.available}
  >
    {slot.time}
  </Button>
);

const AppointmentDialog = ({ doctor, isOpen, onClose, onBook }) => {
  const [availableSlots] = useState(generateAvailableSlots());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctor?.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[300px] pr-4">
          {Object.entries(availableSlots).map(([date, slots]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold mb-2">{new Date(date).toDateString()}</h3>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot, index) => (
                  <AppointmentSlot key={index} date={date} slot={slot} onBook={onBook} />
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const ConfirmationDialog = ({ isOpen, onClose, appointmentDetails }) => {
    if (!appointmentDetails) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Confirmed</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>Your appointment has been booked with {appointmentDetails.doctor}</p>
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

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setIsAppointmentDialogOpen(true);
  };

  const handleBookAppointment = (date, time) => {
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
      <h1 className="text-3xl font-bold mb-8 text-center">Doctor Appointment Scheduler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onSelect={handleDoctorSelect} />
        ))}
      </div>
      <AppointmentDialog
        doctor={selectedDoctor}
        isOpen={isAppointmentDialogOpen}
        onClose={() => setIsAppointmentDialogOpen(false)}
        onBook={handleBookAppointment}
      />
      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onClose={handleConfirmationClose}
        appointmentDetails={appointmentDetails}
      />
    </div>
  );
}