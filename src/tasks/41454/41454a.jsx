import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for alphabets, numbers, and shapes
const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const numbers = Array.from({ length: 21 }, (_, i) => i);
const shapes = [
  'circle',
  'square',
  'triangle',
  'rectangle',
  'oval',
  'star',
  'heart',
  'diamond',
];

// Mock function to simulate speaking. In real-world, you'd use Web Speech API or similar.
const speak = (text) => {
  console.log(`Speaking: ${text}`);
  // Here you would call speech synthesis API
};

function AlphabetSection() {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
      {alphabets.map((letter) => (
        <Card key={letter} className="text-center">
          <CardHeader>
            <img
              src={`/images/alphabet/${letter.toLowerCase()}.png`}
              alt={letter}
              className="w-20 h-20 mx-auto"
            />
          </CardHeader>
          <CardContent>
            <Button onClick={() => speak(letter)}>Say {letter}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NumbersSection() {
  return (
    <div className="grid grid-cols-5 gap-4 sm:grid-cols-3">
      {numbers.map((number) => (
        <Card key={number} className="text-center">
          <CardHeader>
            <img
              src={`/images/numbers/${number}.png`}
              alt={number}
              className="w-20 h-20 mx-auto"
            />
          </CardHeader>
          <CardContent>
            <Button onClick={() => speak(number.toString())}>
              Say {number}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ShapesSection() {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-2">
      {shapes.map((shape) => (
        <Card key={shape} className="text-center">
          <CardHeader>
            <img
              src={`/images/shapes/${shape}.png`}
              alt={shape}
              className="w-20 h-20 mx-auto"
            />
          </CardHeader>
          <CardContent>
            <Button onClick={() => speak(shape)}>Say {shape}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState('alphabet');

  return (
    <div className="p-4 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Pre-Nursery Learning
        </h1>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setSection('alphabet')}
            className="mr-2"
          >
            Alphabet
          </Button>
          <Button variant="outline" onClick={() => setSection('numbers')}>
            Numbers
          </Button>
          <Button
            variant="outline"
            onClick={() => setSection('shapes')}
            className="ml-2"
          >
            Shapes
          </Button>
        </div>
        {section === 'alphabet' && <AlphabetSection />}
        {section === 'numbers' && <NumbersSection />}
        {section === 'shapes' && <ShapesSection />}
      </div>
    </div>
  );
}
