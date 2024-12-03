import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const questions = [
  { id: "q1", text: "Throw litter on the road", type: "don'ts" },
  { id: "q2", text: "Plant trees in your community", type: "do's" },
  { id: "q3", text: "Leave the tap running while brushing teeth", type: "don'ts" },
  { id: "q4", text: "Recycle paper and plastic", type: "do's" },
  { id: "q5", text: "Use single-use plastics", type: "don'ts" },
  { id: "q6", text: "Help an elderly person cross the road", type: "do's" },
  { id: "q7", text: "Smoke in public places", type: "don'ts" },
  { id: "q8", text: "Save electricity when not in use", type: "do's" },
  { id: "q9", text: "Waste food unnecessarily", type: "don'ts" },
  { id: "q10", text: "Use public transportation", type: "do's" },
];

const Section = ({ title, items, onDrop, highlight, bgColor }) => (
  <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={onDrop}
    onTouchMove={(e) => e.preventDefault()} // Prevent scrolling during touch drag
    className={`min-h-[200px] p-4 rounded-lg shadow-md transition-all duration-300 ${
      highlight ? "bg-red-50" : bgColor
    }`}
  >
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    {items.map((item) => (
      <Card key={item.id} className="mb-2 bg-white shadow-sm hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-sm text-gray-700">{item.text}</CardTitle>
        </CardHeader>
      </Card>
    ))}
  </div>
);

export default function App() {
  const [dos, setDos] = useState([]);
  const [donts, setDonts] = useState([]);
  const [unassigned, setUnassigned] = useState(questions);
  const [highlightWrong, setHighlightWrong] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (item) => setDraggedItem(item);

  const handleTouchStart = (item) => setDraggedItem(item);

  const handleTouchEnd = (sectionType) => {
    if (!draggedItem) return;

    const correct = draggedItem.type === sectionType;

    if (!correct) {
      setHighlightWrong(true);
      setTimeout(() => setHighlightWrong(false), 1000);
    }

    setUnassigned((prev) => prev.filter((q) => q.id !== draggedItem.id));
    if (draggedItem.type === "do's") setDos((prev) => [...prev, draggedItem]);
    if (draggedItem.type === "don'ts") setDonts((prev) => [...prev, draggedItem]);

    setDraggedItem(null);
  };

  const resetGame = () => {
    setDos([]);
    setDonts([]);
    setUnassigned(questions);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Drag-and-Drop Questionnaire
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Questions</h2>
          <div className="min-h-[300px] bg-gray-50 p-4 rounded-lg shadow-sm">
            {unassigned.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                onTouchStart={() => handleTouchStart(item)}
                className="cursor-pointer mb-2"
              >
                <Card className="bg-white shadow-sm hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-700">
                      {item.text}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <Section
          title="Do's"
          items={dos}
          onDrop={() => handleTouchEnd("do's")}
          highlight={highlightWrong && draggedItem?.type === "don'ts"}
          bgColor="bg-green-50"
        />
        <Section
          title="Don'ts"
          items={donts}
          onDrop={() => handleTouchEnd("don'ts")}
          highlight={highlightWrong && draggedItem?.type === "do's"}
          bgColor="bg-red-50"
        />
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
