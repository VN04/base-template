import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "@/components/ui/dnd";

const questions = [
  { id: "q1", text: "Throw litter on the road", correct: "don'ts" },
  { id: "q2", text: "Use a reusable water bottle", correct: "do's" },
  { id: "q3", text: "Leave the tap running while brushing teeth", correct: "don'ts" },
  { id: "q4", text: "Plant trees in your community", correct: "do's" },
  { id: "q5", text: "Use plastic bags for shopping", correct: "don'ts" },
  { id: "q6", text: "Recycle paper and plastic", correct: "do's" },
  { id: "q7", text: "Use public transportation", correct: "do's" },
  { id: "q8", text: "Waste food", correct: "don'ts" },
  { id: "q9", text: "Use energy-efficient appliances", correct: "do's" },
  { id: "q10", text: "Burn plastic waste", correct: "don'ts" },
];

const QuestionCard = ({ id, text, index }) => (
  <Draggable draggableId={id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="mb-4"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{text}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )}
  </Draggable>
);

const Section = ({ title, questions, onDragEnd }) => (
  <div className="w-full md:w-1/2 p-4">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <Droppable droppableId={title}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="min-h-[200px] bg-gray-100 p-4 rounded-lg"
        >
          {questions.map((question, index) => (
            <QuestionCard key={question.id} {...question} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default function App() {
  const [dos, setDos] = useState([]);
  const [donts, setDonts] = useState([]);
  const [unassigned, setUnassigned] = useState(questions);

  useEffect(() => {
    const timer = setTimeout(() => {
      const wrongDos = dos.filter((q) => q.correct !== "do's");
      const wrongDonts = donts.filter((q) => q.correct !== "don'ts");

      if (wrongDos.length > 0 || wrongDonts.length > 0) {
        setDos(dos.filter((q) => q.correct === "do's"));
        setDonts(donts.filter((q) => q.correct === "don'ts"));
        setUnassigned([...unassigned, ...wrongDos, ...wrongDonts]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dos, donts]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = source.droppableId === "Unassigned" ? unassigned :
      source.droppableId === "Do's" ? dos : donts;
    const destList = destination.droppableId === "Unassigned" ? unassigned :
      destination.droppableId === "Do's" ? dos : donts;

    const [removed] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, removed);

    setUnassigned([...unassigned]);
    setDos([...dos]);
    setDonts([...donts]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Environmental Do's and Don'ts</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap -mx-4">
          <Section title="Unassigned" questions={unassigned} onDragEnd={onDragEnd} />
          <Section title="Do's" questions={dos} onDragEnd={onDragEnd} />
          <Section title="Don'ts" questions={donts} onDragEnd={onDragEnd} />
        </div>
      </DragDropContext>
      <Button
        className="mt-6"
        onClick={() => {
          setUnassigned(questions);
          setDos([]);
          setDonts([]);
        }}
      >
        Reset
      </Button>
    </div>
  );
}