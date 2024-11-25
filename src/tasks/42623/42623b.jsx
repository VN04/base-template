import React, { useState, useEffect } from 'react';
// import { Input, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cities = ['Kolkata', 'Delhi', 'Mumbai', 'Jaipur', 'Pune', 'Bangalore'];

const buses = {
  'Kolkata-Delhi': [{ id: 1, time: '10:00 AM - 8:00 AM', price: 1500, seats: 10 }],
  'Mumbai-Bangalore': [{ id: 2, time: '8:00 PM - 10:00 AM', price: 1200, seats: 5 }],
  // Add more routes as needed
};

function SearchForm({ onSearch }) {
  const [origin, setOrigin] = useState('');
  // const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ origin, destination, date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select onValueChange={setOrigin}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Origin" />
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select onValueChange={setDestination}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Destination" />
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Button type="submit">Search Buses</Button>
    </form>
  );
}

function BusList({ buses, onBook }) {
  if (!buses.length) return <p className="text-center text-gray-500">No buses available for this route.</p>;

  return buses.map(bus => (
    <Card key={bus.id} className="mb-4">
      <CardHeader>
        <CardTitle>{bus.time}</CardTitle>
        <CardDescription>Price: ₹{bus.price}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Seats Available: {bus.seats}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onBook(bus)} disabled={bus.seats === 0}>Book Now</Button>
      </CardFooter>
    </Card>
  ));
}

function Booking({ bus, onConfirm, onCancel }) {
  const [tickets, setTickets] = useState(1);
  const canBook = tickets <= bus.seats;

  return (
    <div className="space-y-4">
      <Input type="number" value={tickets} onChange={(e) => setTickets(e.target.value)} min="1" max={bus.seats} />
      <p>Total: ₹{bus.price * tickets}</p>
      <Button onClick={() => onConfirm(tickets)} disabled={!canBook}>Pay</Button>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    </div>
  );
}

function Ticket({ details }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <p>From: {details.origin} to {details.destination}</p>
        <p>Date: {details.date}</p>
        <p>Bus Time: {details.bus.time}</p>
        <p>Tickets: {details.tickets}</p>
        <p>Total Paid: ₹{details.bus.price * details.tickets}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);

  const handleSearch = ({ origin, destination, date }) => {
    const route = `${origin}-${destination}`;
    setSearchResults(buses[route] || []);
    setSelectedBus(null);
  };

  const handleBook = (bus) => {
    setSelectedBus(bus);
  };

  const confirmBooking = (tickets) => {
    setTicketDetails({
      origin: searchResults[0].origin,
      destination: searchResults[0].destination,
      date: searchResults[0].date,
      bus: selectedBus,
      tickets: tickets
    });
    setSelectedBus(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Bus Booking System</h1>
      <SearchForm onSearch={handleSearch} />
      {ticketDetails ? 
        <Ticket details={ticketDetails} /> :
        selectedBus ? 
          <Booking bus={selectedBus} onConfirm={confirmBooking} onCancel={() => setSelectedBus(null)} /> :
          <BusList buses={searchResults} onBook={handleBook} />
      }
    </div>
  );
}