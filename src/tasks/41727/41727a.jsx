// import React, { useState } from 'react';
// import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { marked } from 'marked';

// marked.setOptions({
//   breaks: true,
// });

// function MarkdownPreviewer() {
//   const [markdown, setMarkdown] = useState('');
//   const [html, setHtml] = useState('');

//   const handleMarkdownChange = (event) => {
//     const md = event.target.value;
//     setMarkdown(md);
//     setHtml(marked(md));
//   };

//   return (
//     <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
//       <Card className="w-full sm:w-1/2">
//         <CardHeader>
//           <CardTitle>Enter Markdown</CardTitle>
//           <CardDescription>Write your markdown here.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Textarea 
//             value={markdown} 
//             onChange={handleMarkdownChange} 
//             placeholder="Type your markdown here..." 
//             className="h-64"
//           />
//         </CardContent>
//       </Card>

//       <Card className="w-full sm:w-1/2">
//         <CardHeader>
//           <CardTitle>Markdown Preview</CardTitle>
//           <CardDescription>See how your markdown looks.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div 
//             className="prose max-w-none break-words" 
//             dangerouslySetInnerHTML={{ __html: html }}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <div className="min-h-screen bg-background p-4">
//       <div className="container mx-auto max-w-4xl">
//         <header className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-primary">Markdown to HTML Converter</h1>
//           <p className="mt-2 text-muted-foreground">Convert and preview your markdown instantly!</p>
//         </header>
//         <MarkdownPreviewer />
//         <footer className="mt-8 text-center text-sm text-muted-foreground">
//           <p>Simple, fast, and no data stored or sent anywhere.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }