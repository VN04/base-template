// import React, { useState, useEffect } from 'react';
// import { 
//   Card, CardContent, CardHeader, CardTitle, 
//   Button, Input, Label, Select, SelectItem
// } from "@/components/ui";
// import { format, getYear, getMonth, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';

// function Calendar() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [view, setView] = useState('month');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [reminders, setReminders] = useState({});
//   const [reminderText, setReminderText] = useState('');

//   const startOfCurrentMonth = startOfMonth(currentDate);
//   const endOfCurrentMonth = endOfMonth(currentDate);
//   const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

//   const years = Array.from({length: 5}, (_, i) => getYear(currentDate) + i);

//   useEffect(() => {
//     setSelectedDate(null);
//   }, [currentDate, view]);

//   const handleAddReminder = () => {
//     if (selectedDate && reminderText) {
//       const newReminders = { ...reminders, [selectedDate]: [...(reminders[selectedDate] || []), reminderText] };
//       setReminders(newReminders);
//       setReminderText('');
//     }
//   };

//   const Day = ({ day }) => {
//     const remindersForDay = reminders[day] || [];
//     return (
//       <Card className="mb-2">
//         <CardHeader>
//           <CardTitle>{format(day, 'd')}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {remindersForDay.map((reminder, idx) => (
//             <p key={idx}>{reminder}</p>
//           ))}
//           {selectedDate && isSameDay(day, selectedDate) && (
//             <div className="mt-2">
//               <Input 
//                 value={reminderText} 
//                 onChange={(e) => setReminderText(e.target.value)} 
//                 placeholder="Add reminder" 
//               />
//               <Button onClick={handleAddReminder} className="mt-2">Add</Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <Card>
//         <CardHeader>
//           <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
//           <Select value={view} onChange={(e) => setView(e.target.value)}>
//             <SelectItem value="day">Day</SelectItem>
//             <SelectItem value="month">Month</SelectItem>
//             <SelectItem value="year">Year</SelectItem>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           {view === 'month' && (
//             <div className="grid grid-cols-7 gap-2">
//               {daysInMonth.map(day => (
//                 <div 
//                   key={day} 
//                   onClick={() => setSelectedDate(day)} 
//                   className={`cursor-pointer text-center p-2 ${getDay(day) === 0 || getDay(day) === 6 ? 'text-red-500' : ''}`}
//                 >
//                   <Day day={day} />
//                 </div>
//               ))}
//             </div>
//           )}
//           {view === 'year' && (
//             <div className="grid grid-cols-3 gap-4">
//               {years.map(year => (
//                 <Button 
//                   key={year} 
//                   onClick={() => setCurrentDate(new Date(year, 0, 1))} 
//                   variant={year === getYear(currentDate) ? 'default' : 'outline'}
//                 >
//                   {year}
//                 </Button>
//               ))}
//             </div>
//           )}
//           {view === 'day' && (
//             <div>
//               <Day day={currentDate} />
//             </div>
//           )}
//         </CardContent>
//         <CardFooter>
//           <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))} disabled={getYear(addMonths(currentDate, 1)) > getYear(currentDate) + 4}>
//             Next Month
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// export default function App() {
//   return <Calendar />;
// }