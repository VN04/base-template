import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const languages = [
  { name: 'C', icon: 'C' },
  { name: 'Java', icon: 'J' },
  { name: 'PHP', icon: 'P' },
  { name: 'Python', icon: 'Py' },
  { name: 'JavaScript', icon: 'JS' },
];

const articles = {
  C: [{ title: "Introduction to C", content: "Learn the basics of C programming.", image: "/img/c-intro.jpg" }],
  Java: [{ title: "Java Basics", content: "Start with Java fundamentals.", image: "/img/java-basics.jpg" }],
  PHP: [{ title: "PHP for Web", content: "Dive into PHP for web development.", image: "/img/php-web.jpg" }],
  Python: [{ title: "Python 101", content: "Python for beginners.", image: "/img/python-101.jpg" }],
  JavaScript: [{ title: "JS for Web", content: "JavaScript essentials for web developers.", image: "/img/js-web.jpg" }],
};

function CourseArticle({ article }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={article.image} alt={article.title} className="mb-2 w-full h-40 object-cover rounded-lg" />
        <p>{article.content}</p>
      </CardContent>
    </Card>
  );
}

function LanguageTab({ language }) {
  const [selectedLanguage, setSelectedLanguage] = useState(language.name);

  return (
    <Tabs defaultValue={selectedLanguage} className="w-full">
      <TabsList className="grid w-full grid-cols-5 gap-2 mb-4">
        {languages.map(lang => (
          <TabsTrigger 
            key={lang.name} 
            value={lang.name}
            onClick={() => setSelectedLanguage(lang.name)}
          >
            {lang.icon}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedLanguage}>
        {articles[selectedLanguage].map((article, idx) => (
          <CourseArticle key={idx} article={article} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

export default function App() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Learning Platform</h1>
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Language</CardTitle>
          <CardDescription>Select a programming language to start learning.</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageTab language={languages[0]} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Previous</Button>
          <Button>Next</Button>
        </CardFooter>
      </Card>
    </div>
  );
}