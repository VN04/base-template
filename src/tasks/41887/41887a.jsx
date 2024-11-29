import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const questions = [
  "Throw litter in bins",
  "Recycle whenever possible",
  "Use public transport",
  "Turn off lights when not in use",
  "Use reusable bags",
  "Don't throw trash on roads",
  "Avoid single-use plastics",
  "Plant trees",
  "Conserve water",
  "Report illegal dumping"
];

const QuestionCard = ({ question, moveCard, section }) => {
  const [, drop] = useDrop(() => ({
    accept: 'question',
    drop: () => moveCard(question, section),
  }));

  return (
    <div ref={drop} className="mb-4">
      <Card className="w-full max-w-xs mx-auto">
        <CardContent>
          <p>{question}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Section = ({ title, questions, moveCard }) => {
  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {questions.map((q, index) => (
        <QuestionCard key={index} question={q} moveCard={moveCard} section={title.toLowerCase()} />
      ))}
    </div>
  );
};

export default function App() {
  const [dos, setDos] = useState(questions.slice(0, 5));
  const [donts, setDonts] = useState(questions.slice(5, 10));

  const moveCard = (question, toSection) => {
    let fromSection = dos.includes(question) ? 'dos' : 'donts';
    if (fromSection === toSection) return;

    if (toSection === 'dos') {
      setDos(prev => [...prev, question]);
      setDonts(prev => prev.filter(q => q !== question));
    } else {
      setDonts(prev => [...prev, question]);
      setDos(prev => prev.filter(q => q !== question));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Environmental Do's and Don'ts</h1>
          <div className="flex flex-col sm:flex-row justify-between">
            <Section title="Do's" questions={dos} moveCard={moveCard} />
            <Section title="Don'ts" questions={donts} moveCard={moveCard} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}