import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const questions = [
  { id: '1', text: "Throw litter on the road?", type: "don't" },
  { id: '2', text: "Recycle paper and plastics?", type: 'do' },
  { id: '3', text: "Leave the tap running while brushing?", type: "don't" },
  { id: '4', text: "Use public transport when possible?", type: 'do' },
  { id: '5', text: "Leave lights on when leaving a room?", type: "don't" },
  { id: '6', text: "Plant trees in your community?", type: 'do' },
  { id: '7', text: "Use plastic bags for shopping?", type: "don't" },
  { id: '8', text: "Save water by taking shorter showers?", type: 'do' },
  { id: '9', text: "Drive a car for short distances?", type: "don't" },
  { id: '10', text: "Participate in community clean-ups?", type: 'do' },
];

function QuestionCard({ question, index }) {
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-4"
        >
          <Card className="w-full sm:w-80">
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${question.type === 'do' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {question.type === 'do' ? "Do" : "Don't"}
                </span>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <p>Drag to reorder</p>
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

export default function App() {
  const [items, setItems] = useState(questions);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Drag and Drop Questionnaire</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questionList">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-4"
            >
              {items.map((question, index) => (
                <QuestionCard key={question.id} question={question} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <p className="mt-4 text-sm text-gray-500">Reorder the questions based on your priority or preference.</p>
    </div>
  );
}