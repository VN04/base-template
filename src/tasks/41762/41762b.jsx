import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const courses = [
  {
    id: "c",
    name: "C Programming",
    articles: [
      {
        title: "Introduction to C",
        content: "C is a general-purpose programming language...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23555555'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EC%3C/text%3E%3C/svg%3E",
      },
      {
        title: "Variables and Data Types",
        content: "In C, variables are used to store data...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23777777'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3Eint x%3C/text%3E%3C/svg%3E",
      },
    ],
  },
  {
    id: "java",
    name: "Java",
    articles: [
      {
        title: "Java Basics",
        content: "Java is a popular object-oriented programming language...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f89820'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EJava%3C/text%3E%3C/svg%3E",
      },
      {
        title: "Object-Oriented Programming in Java",
        content: "Java supports object-oriented programming paradigms...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f89820'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3EOOP%3C/text%3E%3C/svg%3E",
      },
    ],
  },
  {
    id: "php",
    name: "PHP",
    articles: [
      {
        title: "Getting Started with PHP",
        content: "PHP is a server-side scripting language...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%238993be'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EPHP%3C/text%3E%3C/svg%3E",
      },
      {
        title: "PHP and MySQL",
        content: "PHP works well with MySQL databases...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%238993be'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3EMySQL%3C/text%3E%3C/svg%3E",
      },
    ],
  },
  {
    id: "python",
    name: "Python",
    articles: [
      {
        title: "Python Fundamentals",
        content: "Python is a high-level, interpreted programming language...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23306998'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EPython%3C/text%3E%3C/svg%3E",
      },
      {
        title: "Python Data Structures",
        content: "Python offers various built-in data structures...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23306998'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3EList%3C/text%3E%3C/svg%3E",
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    articles: [
      {
        title: "JavaScript Essentials",
        content: "JavaScript is a versatile programming language...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f7df1e'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='18' fill='black' text-anchor='middle' dy='.3em'%3EJS%3C/text%3E%3C/svg%3E",
      },
      {
        title: "DOM Manipulation",
        content: "JavaScript can interact with the Document Object Model...",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f7df1e'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='18' fill='black' text-anchor='middle' dy='.3em'%3EDOM%3C/text%3E%3C/svg%3E",
      },
    ],
  },
];

const Dashboard = ({ onSelectCourse }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
    {courses.map((course) => (
      <Card key={course.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{course.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onSelectCourse(course)}>Start Learning</Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const CourseContent = ({ course, onBack }) => (
  <div className="p-4">
    <Button onClick={onBack} className="mb-4">
      Back to Dashboard
    </Button>
    <h2 className="text-2xl font-bold mb-4">{course.name}</h2>
    <Tabs defaultValue={course.articles[0].title}>
      <TabsList className="mb-4">
        {course.articles.map((article) => (
          <TabsTrigger key={article.title} value={article.title}>
            {article.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {course.articles.map((article) => (
        <TabsContent key={article.title} value={article.title}>
          <Card>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={article.image}
                alt={article.title}
                className="w-24 h-24 mb-4 mx-auto"
              />
              <p>{article.content}</p>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Learning Platform
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {selectedCourse ? (
          <CourseContent course={selectedCourse} onBack={handleBack} />
        ) : (
          <Dashboard onSelectCourse={handleSelectCourse} />
        )}
      </main>
    </div>
  );
}