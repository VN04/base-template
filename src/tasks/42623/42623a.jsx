import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const cities = ["Kolkata", "Delhi", "Mumbai", "Jaipur", "Pune", "Bangalore"];

const busRoutes = [
  { from: "Kolkata", to: "Delhi", buses: [
    { id: 1, departure: "10:00", arrival: "22:00", price: 1500, seats: 30 },
    { id: 2, departure: "14:00", arrival: "02:00", price: 1800, seats: 25 },
  ]},
  { from: "Mumbai", to: "Pune", buses: [
    { id: 3, departure: "08:00", arrival: "12:00", price: 500, seats: 40 },
    { id: 4, departure: "16:00", arrival: "20:00", price: 600, seats: 35 },
  ]},
  // Add more routes as needed
];

export default function App() {
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const availableBuses = busRoutes.find(
    route => route.from === from && route.to === to
  )?.buses || [];

  const handleSearch = () => {
    if (from && to && date) {
      setStep(2);
    }
  };

  const handleBooking = (bus) => {
    setSelectedBus(bus);
    setStep(3);
  };

  const handlePayment = () => {
    setPaymentComplete(true);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Bus Booking App
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <SearchForm
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              date={date}
              setDate={setDate}
              handleSearch={handleSearch}
            />
          )}
          {step === 2 && (
            <BusList
              buses={availableBuses}
              handleBooking={handleBooking}
            />
          )}
          {step === 3 && (
            <BookingConfirmation
              bus={selectedBus}
              tickets={tickets}
              setTickets={setTickets}
              handlePayment={handlePayment}
            />
          )}
          {step === 4 && (
            <Ticket
              bus={selectedBus}
              from={from}
              to={to}
              date={date}
              tickets={tickets}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SearchForm({ from, setFrom, to, setTo, date, setDate, handleSearch }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="from">From</Label>
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger id="from">
            <SelectValue placeholder="Select origin city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="to">To</Label>
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger id="to">
            <SelectValue placeholder="Select destination city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date of Travel</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <Button onClick={handleSearch} className="w-full">
        Search Buses
      </Button>
    </div>
  );
}

function BusList({ buses, handleBooking }) {
  if (buses.length === 0) {
    return <p className="text-center">No buses available for this route.</p>;
  }

  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <Card key={bus.id} className="flex justify-between items-center p-4">
          <div>
            <p className="font-semibold">
              {bus.departure} - {bus.arrival}
            </p>
            <p>Price: ₹{bus.price}</p>
            <p>Available Seats: {bus.seats}</p>
          </div>
          <Button onClick={() => handleBooking(bus)}>Book</Button>
        </Card>
      ))}
    </div>
  );
}

function BookingConfirmation({ bus, tickets, setTickets, handlePayment }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Booking Details</h3>
      <p>Departure: {bus.departure}</p>
      <p>Arrival: {bus.arrival}</p>
      <p>Price per ticket: ₹{bus.price}</p>
      <div className="flex items-center space-x-2">
        <Label htmlFor="tickets">Number of Tickets:</Label>
        <Input
          id="tickets"
          type="number"
          min="1"
          max={bus.seats}
          value={tickets}
          onChange={(e) => setTickets(Math.min(parseInt(e.target.value), bus.seats))}
          className="w-20"
        />
      </div>
      <p className="font-semibold">Total Amount: ₹{bus.price * tickets}</p>
      <Button onClick={handlePayment} className="w-full">
        Pay Now
      </Button>
    </div>
  );
}

function Ticket({ bus, from, to, date, tickets }) {
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-center">Bus Ticket</h3>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>From:</strong> {from}</p>
        <p><strong>To:</strong> {to}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Departure:</strong> {bus.departure}</p>
        <p><strong>Arrival:</strong> {bus.arrival}</p>
        <p><strong>Tickets:</strong> {tickets}</p>
        <p><strong>Total Amount:</strong> ₹{bus.price * tickets}</p>
      </div>
      <p className="text-center text-sm text-gray-500">
        Thank you for booking with us!
      </p>
    </div>
  );
}