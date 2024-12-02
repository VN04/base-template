import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const cities = ["Kolkata", "Delhi", "Mumbai", "Jaipur", "Pune", "Bangalore"];

const busRoutes = [
  {
    from: "Kolkata",
    to: "Delhi",
    buses: [
      { id: 1, departure: "10:00 AM", arrival: "10:00 PM", price: 1500, seats: 30 },
      { id: 2, departure: "2:00 PM", arrival: "2:00 AM", price: 1800, seats: 25 },
    ],
  },
  {
    from: "Mumbai",
    to: "Pune",
    buses: [
      { id: 3, departure: "8:00 AM", arrival: "12:00 PM", price: 500, seats: 40 },
      { id: 4, departure: "4:00 PM", arrival: "8:00 PM", price: 600, seats: 35 },
    ],
  },
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
    (route) => route.from === from && route.to === to
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
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4 sm:p-6 flex items-center justify-center">
      <Card className="max-w-2xl w-full bg-white shadow-xl rounded-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg py-4">
          <CardTitle className="text-2xl font-bold text-center">
            Bus Booking App
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
              goBack={() => setStep(1)}
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

function SearchableDropdown({ label, options, value, onChange, placeholder }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <Label className="font-semibold">{label}</Label>
      <div
        className="border rounded-md p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
          <div className="p-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function SearchForm({ from, setFrom, to, setTo, date, setDate, handleSearch }) {
  return (
    <div className="space-y-4">
      <SearchableDropdown
        label="From"
        options={cities}
        value={from}
        onChange={setFrom}
        placeholder="Select origin city"
      />
      <SearchableDropdown
        label="To"
        options={cities}
        value={to}
        onChange={setTo}
        placeholder="Select destination city"
      />
      <div className="space-y-2">
        <Label htmlFor="date" className="font-semibold">
          Date of Travel
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold mt-4"
      >
        Search Buses
      </Button>
    </div>
  );
}

function BusList({ buses, handleBooking, goBack }) {
  if (buses.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-gray-600">No buses available for this route.</p>
        <Button
          onClick={goBack}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <Card
          key={bus.id}
          className="flex justify-between items-center p-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <div>
            <p className="font-semibold">
              {bus.departure} - {bus.arrival}
            </p>
            <p>Price: ₹{bus.price}</p>
            <p>Available Seats: {bus.seats}</p>
          </div>
          <Button
            onClick={() => handleBooking(bus)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            Book
          </Button>
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
          onChange={(e) =>
            setTickets(Math.min(parseInt(e.target.value) || 1, bus.seats))
          }
          className="w-20"
        />
      </div>
      <p className="font-semibold">Total Amount: ₹{bus.price * tickets}</p>
      <Button
        onClick={handlePayment}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
      >
        Pay Now
      </Button>
    </div>
  );
}

function Ticket({ bus, from, to, date, tickets }) {
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center">Booking Confirmed</h3>
      <p>From: {from}</p>
      <p>To: {to}</p>
      <p>Date: {date}</p>
      <p>Departure: {bus.departure}</p>
      <p>Arrival: {bus.arrival}</p>
      <p>Tickets: {tickets}</p>
      <p>Total Paid: ₹{bus.price * tickets}</p>
    </div>
  );
}
