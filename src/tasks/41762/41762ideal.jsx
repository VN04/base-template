import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const courses = {
  C: [
    { title: "Introduction to C", url: "https://www.youtube.com/embed/KJgsSFOSQv0" },
    { title: "C Data Types", url: "https://www.youtube.com/embed/Mkx9HWjwRdg" },
  ],
  Java: [
    { title: "Java Basics", url: "https://www.youtube.com/embed/eIrMbAQSU34" },
    { title: "Java OOP", url: "https://www.youtube.com/embed/pTB0EiLXUC8" },
  ],
  PHP: [
    { title: "PHP for Beginners", url: "https://www.youtube.com/embed/OK_JCtrrv-c" },
    { title: "PHP Forms", url: "https://www.youtube.com/embed/nPYKOoXoAjM" },
  ],
  Python: [
    { title: "Python Crash Course", url: "https://www.youtube.com/embed/kqtD5dpn9C8" },
    { title: "Python Functions", url: "https://www.youtube.com/embed/9Os0o3wzS_I" },
  ],
  JavaScript: [
    { title: "JavaScript Fundamentals", url: "https://www.youtube.com/embed/W6NZfCO5SIk" },
    { title: "JavaScript DOM", url: "https://www.youtube.com/embed/0ik6X4DJKCc" },
  ],
};

const Dashboard = ({ onSelectCourse }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
    {Object.keys(courses).map((course) => (
      <Card key={course} className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>{course}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onSelectCourse(course)}>Start Learning</Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const CourseContent = ({ course, onBack }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="p-4">
      <Button onClick={onBack} className="mb-4">
        Back to Dashboard
      </Button>
      <h2 className="text-2xl font-bold mb-4">{course} Tutorials</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          {courses[course].map((video, index) => (
            <Card
              key={index}
              className="mb-2 cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedVideo(video)}
            >
              <CardHeader>
                <CardTitle className="text-sm">{video.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="md:col-span-2">
          {selectedVideo ? (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              ></iframe>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
              Select a video to start learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Multi-Language Learning Platform</h1>
      </header>
      <Separator />
      <main>
        {selectedCourse ? (
          <CourseContent
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
          />
        ) : (
          <Dashboard onSelectCourse={setSelectedCourse} />
        )}
      </main>
      <Separator />
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        © 2023 Multi-Language Learning Platform. All rights reserved.
      </footer>
    </div>
  );
}
