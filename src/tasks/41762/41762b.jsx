import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const courses = [
  {
    id: "c",
    name: "C Programming",
    description: "Learn the fundamentals of C programming language",
    articles: [
      {
        title: "Introduction to C",
        content: `C is a general-purpose programming language created by Dennis Ritchie at the Bell Laboratories in 1972. It is a very popular language, despite being old. C is very powerful; it has been used to develop operating systems, databases, applications, and more.

C is a compiled language - which means that in order to run it, the compiler (for example, GCC or Visual Studio) must take the code that we wrote, process it, and then create an executable file. This file can then be run, and it will do what we intended for the program to do.

![C Programming](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/C_Programming_Language.svg/1200px-C_Programming_Language.svg.png)

Some of the key advantages of C include:
1. Fast and efficient
2. Portable (can run on different platforms)
3. Powerful and flexible
4. Extensive library support

C is often used in situations where speed and flexibility are important, such as in operating systems, embedded systems, and game development.`,
      },
      // Add more articles for C
    ],
  },
  {
    id: "java",
    name: "Java",
    description: "Master Java programming language",
    articles: [
      {
        title: "Getting Started with Java",
        content: `Java is a popular programming language, created in 1995 by Sun Microsystems. It is owned by Oracle, and more than 3 billion devices run Java. Java is a general-purpose, class-based, object-oriented programming language designed for having lesser implementation dependencies.

Java follows the principle of WORA (Write Once, Run Anywhere), which means that compiled Java code can run on all platforms that support Java without the need for recompilation. This is achieved through the Java Virtual Machine (JVM).

![Java Programming](https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/1200px-Java_programming_language_logo.svg.png)

Key features of Java include:
1. Object-Oriented: Everything in Java is an object which makes it easy to model real-world scenarios
2. Platform Independent: Java code can run on any platform that has a JVM
3. Secure: Java has built-in security features
4. Robust: Java has strong memory management and exception handling

Java is widely used for developing enterprise applications, Android apps, web applications, and more.`,
      },
      // Add more articles for Java
    ],
  },
  // Add similar objects for PHP, Python, and JavaScript
];

function Dashboard({ onSelectCourse }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onSelectCourse(course)}>Start Learning</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CourseContent({ course, onBack }) {
  return (
    <div className="p-4">
      <Button onClick={onBack} className="mb-4">
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
      {course.articles.map((article, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {article.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph.startsWith("![") ? (
                    <img
                      src={paragraph.match(/\((.*?)\)/)[1]}
                      alt={paragraph.match(/\[(.*?)\]/)[1]}
                      className="w-full max-w-md mx-auto my-4"
                    />
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Learn Programming</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {selectedCourse ? (
            <CourseContent course={selectedCourse} onBack={handleBack} />
          ) : (
            <Dashboard onSelectCourse={handleSelectCourse} />
          )}
        </div>
      </main>
    </div>
  );
}