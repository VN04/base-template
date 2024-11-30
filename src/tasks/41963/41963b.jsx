// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { format, addDays, startOfDay } from 'date-fns';

// const doctors = [
//   { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
//   { id: 2, name: 'Dr. Lee', specialty: 'Neurology' },
//   { id: 3, name: 'Dr. Patel', specialty: 'Pediatrics' },
// ];

// const generateTimeSlots = (startDate, endDate) => {
//   const slots = [];
//   for (let d = startDate; d <= endDate; d.setHours(d.getHours() + 1)) {
//     if (d.getHours() >= 9 && d.getHours() < 17) { // 9 AM to 5 PM
//       slots.push(new Date(d));
//     }
//   }
//   return slots;
// };

// function DoctorCard({ doctor, onClick }) {
//   return (
//     <Card className="mb-4 sm:mb-0">
//       <CardHeader>
//         <CardTitle>{doctor.name}</CardTitle>
//         <CardDescription>{doctor.specialty}</CardDescription>
//       </CardHeader>
//       <CardFooter>
//         <Button onClick={() => onClick(doctor)}>View Schedule</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// function Schedule({ doctor, slots, onBook, onBack }) {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold">Schedule for {doctor.name}</h2>
//       {slots.map((slot, index) => (
//         <Card key={index}>
//           <CardContent>
//             <p>{format(slot, 'EEE, MMM d, yyyy h:mm a')}</p>
//             <Button 
//               onClick={() => onBook(slot)} 
//               disabled={!slot.available}
//             >
//               {slot.available ? 'Book Now' : 'Booked'}
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//       <Button onClick={onBack}>Back to Doctors</Button>
//     </div>
//   );
// }

// function AppointmentConfirmation({ appointment, onBack }) {
//   return (
//     <div className="text-center space-y-4">
//       <h2 className="text-2xl font-bold">Appointment Confirmed!</h2>
//       <p>Your appointment with {appointment.doctor.name} is at {format(appointment.time, 'EEE, MMM d, yyyy h:mm a')}.</p>
//       <Button onClick={onBack}>Back to Dashboard</Button>
//     </div>
//   );
// }

// export default function App() {
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [bookedAppointment, setBookedAppointment] = useState(null);
//   const [slots, setSlots] = useState([]);

//   const handleDoctorClick = (doctor) => {
//     const today = startOfDay(new Date());
//     const timeSlots = generateTimeSlots(today, addDays(today, 2));
//     setSlots(timeSlots.map(time => ({ time, available: true })));
//     setSelectedDoctor(doctor);
//     setBookedAppointment(null);
//   };

//   const handleBook = (slot) => {
//     const updatedSlots = slots.map(s => s.time === slot ? { ...s, available: false } : s);
//     setSlots(updatedSlots);
//     setBookedAppointment({ doctor: selectedDoctor, time: slot });
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold text-center mb-8">Doctor Appointment Scheduler</h1>
//       {bookedAppointment ? (
//         <AppointmentConfirmation appointment={bookedAppointment} onBack={() => setBookedAppointment(null)} />
//       ) : selectedDoctor ? (
//         <Schedule 
//           doctor={selectedDoctor} 
//           slots={slots} 
//           onBook={handleBook} 
//           onBack={() => setSelectedDoctor(null)} 
//         />
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {doctors.map(doctor => (
//             <DoctorCard key={doctor.id} doctor={doctor} onClick={handleDoctorClick} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }