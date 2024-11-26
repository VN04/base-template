import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const languages = ['C', 'Java', 'PHP', 'Python', 'JavaScript'];

const articles = {
  'C': [
    { title: 'Introduction to C', content: 'C is a powerful general-purpose programming language...', image: 'https://example.com/c-intro.jpg' },
    // More articles...
  ],
  'Java': [
    { title: 'Getting Started with Java', content: 'Java is known for its "write once, run anywhere" philosophy...', image: 'https://example.com/java-start.jpg' },
    // More articles...
  ],
  // Add similar entries for PHP, Python, and JavaScript
};

function ArticleCard({ article }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={article.image} alt={article.title} className="mb-4 w-full object-cover h-48 sm:h-64" />
        <p>{article.content}</p>
      </CardContent>
    </Card>
  );
}

function LanguageTab({ language }) {
  return (
    <TabsContent value={language}>
      {articles[language].map((article, idx) => (
        <ArticleCard key={idx} article={article} />
      ))}
    </TabsContent>
  );
}

function Dashboard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center my-6">Choose Your Language</h1>
      <Tabs defaultValue="C" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-4">
          {languages.map(lang => (
            <TabsTrigger key={lang} value={lang}>{lang}</TabsTrigger>
          ))}
        </TabsList>
        {languages.map(lang => (
          <LanguageTab key={lang} language={lang} />
        ))}
      </Tabs>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentView === 'dashboard' ? 'Learning Dashboard' : 'Back to Courses'}
          </h1>
        </div>
      </header>
      <main className="py-6">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <Button onClick={() => setCurrentView('dashboard')} className="mb-4 ml-4">Back</Button>
        )}
      </main>
    </div>
  );
}