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
  {
    id: "php",
    name: "PHP",
    description: "Master PHP programming language",
    articles: [
      {
        title: "Getting Started with PHP",
        content: `PHP is a general-purpose, open-source scripting language that's used to create dynamic websites and web applications. It's primarily used for server-side scripting, but can also be used for command line scripting.

![PHP Programming](https:////upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/121px-PHP-logo.svg.png)

What is PHP:
1. PHP is an acronym for "PHP: Hypertext Preprocessor"
2. PHP is a widely-used, open source scripting language
3. PHP scripts are executed on the server
4. PHP is free to download and use`,
      },
      // Add more articles for Java
    ],
  },
  {
    id: "python",
    name: "Python",
    description: "Master Python programming language",
    articles: [
      {
        title: "Getting Started with Python",
        content: `Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.

![PHP Programming](https:////upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/121px-Python-logo-notext.svg.png)

It is used for:

1. web development (server-side),
2. software development,
3. mathematics,
4. system scripting.

What can Python do?
1. Python can be used on a server to create web applications.
2. Python can be used alongside software to create workflows.
3. Python can connect to database systems. It can also read and modify files.
4. Python can be used to handle big data and perform complex mathematics.
5. Python can be used for rapid prototyping, or for production-ready software development.
`,
      },
      // Add more articles for Java
    ],
  },
  {
    id: "javascript",
    name: "Javascript",
    description: "Master Javascript programming language",
    articles: [
      {
        title: "Getting Started with Javascript",
        content: `JavaScript is a programming language used for creating dynamic content on websites. It is a lightweight, cross-platform, and single-threaded programming language. JavaScript is an interpreted language that executes code line by line providing more flexibility.

![PHP Programming](https:////upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/64px-Unofficial_JavaScript_logo_2.svg.png)

HTML adds Structure to a Webpage, CSS styles it, and JavaScript brings it to life by allowing users to interact with elements on the page, such as actions on clicking buttons, filling out forms, and showing animations.
JavaScript on the client side is directly executed in the user's browser. Almost all browsers have JavaScript Interpreter and do not need to install any software. There is a console also in browsers where you can try and test your JavaScript code.
JavaScript is also used on Server side (on Web Servers) to do operations like accessing databases, file handling and security features to send responses, to browsers.
`,
      },
      // Add more articles for Java
    ],
  },
  // Add similar objects for PHP, Python, and JavaScript
];

function Dashboard({ onSelectCourse }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <Card key={course.id} className="transform transition-transform hover:scale-105 hover:shadow-xl border rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">{course.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="bg-blue-500 text-white hover:bg-blue-600 w-full py-2 rounded-md font-medium" onClick={() => onSelectCourse(course)}>Start Learning</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CourseContent({ course, onBack }) {
  return (
    <div className="p-6">
      <Button onClick={onBack} className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg">
        Back to Dashboard
      </Button>
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{course.name}</h1>
      {course.articles.map((article, index) => (
        <Card key={index} className="mb-6 border rounded-lg shadow-sm hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">{article.title}</CardTitle>
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
    <div className="min-h-screen bg-gray-50">
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