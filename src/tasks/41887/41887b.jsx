// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@/components/ui/dnd";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const questions = [
//   { id: "q1", text: "Throw litter on the road", type: "dont" },
//   { id: "q2", text: "Use reusable shopping bags", type: "do" },
//   { id: "q3", text: "Leave the water running while brushing teeth", type: "dont" },
//   { id: "q4", text: "Recycle paper and plastic", type: "do" },
//   { id: "q5", text: "Use single-use plastic straws", type: "dont" },
//   { id: "q6", text: "Plant trees in your community", type: "do" },
//   { id: "q7", text: "Waste food unnecessarily", type: "dont" },
//   { id: "q8", text: "Use public transportation", type: "do" },
//   { id: "q9", text: "Leave electronic devices on standby", type: "dont" },
//   { id: "q10", text: "Compost organic waste", type: "do" },
// ];

// const QuestionCard = ({ question, index }) => (
//   <Draggable draggableId={question.id} index={index}>
//     {(provided) => (
//       <div
//         ref={provided.innerRef}
//         {...provided.draggableProps}
//         {...provided.dragHandleProps}
//         className="mb-4"
//       >
//         <Card className={`bg-${question.type === "do" ? "green" : "red"}-100`}>
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold">
//               {question.type === "do" ? "Do" : "Don't"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-700">{question.text}</p>
//           </CardContent>
//         </Card>
//       </div>
//     )}
//   </Draggable>
// );

// const QuestionList = ({ questions, droppableId }) => (
//   <Droppable droppableId={droppableId}>
//     {(provided) => (
//       <div {...provided.droppableProps} ref={provided.innerRef}>
//         {questions.map((question, index) => (
//           <QuestionCard key={question.id} question={question} index={index} />
//         ))}
//         {provided.placeholder}
//       </div>
//     )}
//   </Droppable>
// );

// export default function App() {
//   const [dos, setDos] = useState([]);
//   const [donts, setDonts] = useState([]);
//   const [remainingQuestions, setRemainingQuestions] = useState(questions);

//   const onDragEnd = (result) => {
//     const { source, destination } = result;

//     if (!destination) return;

//     const sourceList = source.droppableId === "remaining" ? remainingQuestions :
//       source.droppableId === "dos" ? dos : donts;
//     const destList = destination.droppableId === "remaining" ? remainingQuestions :
//       destination.droppableId === "dos" ? dos : donts;

//     const [reorderedItem] = sourceList.splice(source.index, 1);
//     destList.splice(destination.index, 0, reorderedItem);

//     setRemainingQuestions([...remainingQuestions]);
//     setDos([...dos]);
//     setDonts([...donts]);
//   };

//   const resetQuestions = () => {
//     setRemainingQuestions(questions);
//     setDos([]);
//     setDonts([]);
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Drag-and-Drop Questionnaire
//       </h1>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Questions</h2>
//             <QuestionList
//               questions={remainingQuestions}
//               droppableId="remaining"
//             />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Do's</h2>
//             <QuestionList questions={dos} droppableId="dos" />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Don'ts</h2>
//             <QuestionList questions={donts} droppableId="donts" />
//           </div>
//         </div>
//       </DragDropContext>
//       <div className="mt-8 text-center">
//         <Button onClick={resetQuestions} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Reset Questions
//         </Button>
//       </div>
//     </div>
//   );
// }