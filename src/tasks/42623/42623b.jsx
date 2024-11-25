import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow"];

const buses = [
  { id: 1, from: "Mumbai", to: "Pune", departure: "08:00", arrival: "12:00", price: 300, seats: 40 },
  { id: 2, from: "Delhi", to: "Jaipur", departure: "09:00", arrival: "15:00", price: 450, seats: 30 },
  // Add more buses as needed
];

function SearchForm({ onSearch }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader>
        <CardTitle>Find Your Bus</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{origin || "Select Origin"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Origin City</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cities.map(city => <DropdownMenuItem key={city} onClick={() => setOrigin(city)}>{city}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{destination || "Select Destination"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Destination City</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cities.map(city => <DropdownMenuItem key={city} onClick={() => setDestination(city)}>{city}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Travel Date" />
        <Button onClick={() => onSearch({origin, destination, date})}>Search Buses</Button>
      </CardContent>
    </Card>
  );
}

function BusList({ buses, onBook }) {
  return (
    <div className="space-y-4 mt-4">
      {buses.map(bus => (
        <Card key={bus.id}>
          <CardHeader>
            <CardTitle>{bus.from} to {bus.to}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Departure: {bus.departure} | Arrival: {bus.arrival}</p>
            <p>Price: ₹{bus.price}</p>
            <p>Seats Available: {bus.seats}</p>
          </CardContent>
          <Button onClick={() => onBook(bus)} disabled={bus.seats === 0}>Book Now</Button>
        </Card>
      ))}
    </div>
  );
}

function Ticket({ bus, tickets, onPay }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Your Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <p>From: {bus.from} to {bus.to}</p>
        <p>Date: {new Date().toDateString()}</p>
        <p>Tickets: {tickets}</p>
        <p>Total: ₹{bus.price * tickets}</p>
      </CardContent>
      <Button onClick={onPay}>Pay Now</Button>
    </Card>
  );
}

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [showTicket, setShowTicket] = useState(false);

  const handleSearch = ({origin, destination, date}) => {
    if (origin && destination && date) {
      const results = buses.filter(bus => bus.from === origin && bus.to === destination);
      setSearchResults(results);
    }
  };

  const handleBook = (bus) => {
    setSelectedBus(bus);
  };

  const handlePay = () => {
    alert('Payment Successful! Here is your ticket.');
    setShowTicket(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Bus Booking App</h1>
      <SearchForm onSearch={handleSearch} />
      {searchResults.length > 0 && <BusList buses={searchResults} onBook={handleBook} />}
      {selectedBus && (
        <div className="mt-4">
          <Input 
            type="number" 
            min="1" 
            max={selectedBus.seats} 
            value={ticketsToBook} 
            onChange={e => setTicketsToBook(Number(e.target.value))} 
            placeholder="Number of tickets"
          />
          <Ticket bus={selectedBus} tickets={ticketsToBook} onPay={handlePay} />
        </div>
      )}
      {showTicket && (
        <div className="mt-4">
          <Card>
            <CardContent>
              <h2 className="text-xl">Thank You for Booking!</h2>
              <p>Your travel from {selectedBus.from} to {selectedBus.to} is confirmed.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}