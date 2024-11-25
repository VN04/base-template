import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"
];

const busData = [
  { id: 1, departure: "08:00", arrival: "14:00", price: 500, seats: 30 },
  { id: 2, departure: "10:00", arrival: "16:00", price: 450, seats: 25 },
  { id: 3, departure: "12:00", arrival: "18:00", price: 550, seats: 35 },
];

function SearchForm({ onSearch }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ origin, destination, date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select onValueChange={setOrigin}>
        <SelectTrigger>
          <SelectValue placeholder="Select origin" />
        </SelectTrigger>
        <SelectContent>
          {indianCities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setDestination}>
        <SelectTrigger>
          <SelectValue placeholder="Select destination" />
        </SelectTrigger>
        <SelectContent>
          {indianCities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Button type="submit">Search Buses</Button>
    </form>
  );
}

function BusList({ buses, onBook }) {
  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <Card key={bus.id}>
          <CardHeader>
            <CardTitle>Bus {bus.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Departure: {bus.departure}</p>
            <p>Arrival: {bus.arrival}</p>
            <p>Price: ₹{bus.price}</p>
            <p>Available Seats: {bus.seats}</p>
            <Button onClick={() => onBook(bus)}>Book Ticket</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookingForm({ bus, onConfirm }) {
  const [seats, setSeats] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(seats);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        min="1"
        max={bus.seats}
        value={seats}
        onChange={(e) => setSeats(parseInt(e.target.value))}
      />
      <p>Total Amount: ₹{bus.price * seats}</p>
      <Button type="submit">Pay Now</Button>
    </form>
  );
}

function Ticket({ booking }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <p>From: {booking.origin}</p>
        <p>To: {booking.destination}</p>
        <p>Date: {booking.date}</p>
        <p>Departure: {booking.bus.departure}</p>
        <p>Arrival: {booking.bus.arrival}</p>
        <p>Seats: {booking.seats}</p>
        <p>Total Amount: ₹{booking.bus.price * booking.seats}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState("search");
  const [searchParams, setSearchParams] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [booking, setBooking] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
    setStep("list");
  };

  const handleBook = (bus) => {
    setSelectedBus(bus);
    setStep("book");
  };

  const handleConfirm = (seats) => {
    setBooking({ ...searchParams, bus: selectedBus, seats });
    setStep("ticket");
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Bus Booking App</h1>
      {step === "search" && <SearchForm onSearch={handleSearch} />}
      {step === "list" && <BusList buses={busData} onBook={handleBook} />}
      {step === "book" && <BookingForm bus={selectedBus} onConfirm={handleConfirm} />}
      {step === "ticket" && <Ticket booking={booking} />}
    </div>
  );
}