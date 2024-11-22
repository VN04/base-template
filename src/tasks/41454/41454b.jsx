import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const numbers = Array.from({ length: 21 }, (_, i) => i);
const shapes = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Oval', 'Star'];

const Section = ({ title, items, type }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const getEmoji = (item) => {
    if (type === 'alphabet')
      return String.fromCodePoint(127462 + alphabets.indexOf(item));
    if (type === 'number') return String.fromCodePoint(48 + parseInt(item));
    if (type === 'shape') {
      const shapeEmojis = {
        Circle: '⭕',
        Square: '🟥',
        Triangle: '🔺',
        Rectangle: '🟩',
        Oval: '🥚',
        Star: '⭐',
      };
      return shapeEmojis[item];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Card
              key={item}
              className={`cursor-pointer transition-transform transform hover:scale-105 ${
                selectedItem === item ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{getEmoji(item)}</div>
                <div className="text-xl font-bold">{item}</div>
                <Button
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(item);
                  }}
                >
                  🔊 Play
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Pre-Nursery Education App
      </h1>
      <Tabs defaultValue="alphabet" className="w-full">
        <TabsList className="w-full flex justify-center mb-4">
          <TabsTrigger value="alphabet" className="px-4 py-2">
            Alphabets
          </TabsTrigger>
          <TabsTrigger value="number" className="px-4 py-2">
            Numbers
          </TabsTrigger>
          <TabsTrigger value="shape" className="px-4 py-2">
            Shapes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="alphabet">
          <Section
            title="Alphabet Training"
            items={alphabets}
            type="alphabet"
          />
        </TabsContent>
        <TabsContent value="number">
          <Section title="Number Training" items={numbers} type="number" />
        </TabsContent>
        <TabsContent value="shape">
          <Section title="Shape Training" items={shapes} type="shape" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
