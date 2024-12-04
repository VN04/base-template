import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DraggableSection = ({ id, index, moveSection, children }) => {
  const [, drag] = useDrag({
    type: "SECTION",
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="mb-4">
      {children}
    </div>
  );
};

const ResumeBuilder = () => {
  const [basicInfo, setBasicInfo] = useState({ name: "", email: "", phone: "", linkedin: "", website: "" });
  const [sections, setSections] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [fontStyle, setFontStyle] = useState("font-sans");
  const [fontSize, setFontSize] = useState("text-base");
  const [alignment, setAlignment] = useState("text-left");

  const handleBasicInfoChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const addSection = () => {
    setSections([...sections, { title: "", content: "" }]);
  };

  const updateSection = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const moveSection = useCallback((dragIndex, hoverIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const [removed] = updatedSections.splice(dragIndex, 1);
      updatedSections.splice(hoverIndex, 0, removed);
      return updatedSections;
    });
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(basicInfo.name, 20, 20);
    doc.setFontSize(12);
    doc.text(`${basicInfo.email} | ${basicInfo.phone}`, 20, 30);
    if (basicInfo.linkedin) doc.text(`LinkedIn: ${basicInfo.linkedin}`, 20, 40);
    if (basicInfo.website) doc.text(`Website: ${basicInfo.website}`, 20, 50);

    let yOffset = 60;
    sections.forEach((section) => {
      doc.setFontSize(14);
      doc.text(section.title, 20, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
      const contentLines = doc.splitTextToSize(section.content, 170);
      doc.text(contentLines, 20, yOffset);
      yOffset += contentLines.length * 7 + 10;
    });

    doc.save("resume.pdf");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`container mx-auto p-4 ${fontStyle} ${fontSize} ${alignment}`}>
        <h1 className="text-3xl font-bold mb-4">Resume Builder</h1>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  name="name"
                  placeholder="Name"
                  value={basicInfo.name}
                  onChange={handleBasicInfoChange}
                  className="mb-2"
                />
                <Input
                  name="email"
                  placeholder="Email"
                  value={basicInfo.email}
                  onChange={handleBasicInfoChange}
                  className="mb-2"
                />
                <Input
                  name="phone"
                  placeholder="Phone"
                  value={basicInfo.phone}
                  onChange={handleBasicInfoChange}
                  className="mb-2"
                />
                <Input
                  name="linkedin"
                  placeholder="LinkedIn Profile"
                  value={basicInfo.linkedin}
                  onChange={handleBasicInfoChange}
                  className="mb-2"
                />
                <Input
                  name="website"
                  placeholder="Personal Website"
                  value={basicInfo.website}
                  onChange={handleBasicInfoChange}
                  className="mb-2"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <CardTitle>Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                {sections.map((section, index) => (
                  <DraggableSection key={index} id={index} index={index} moveSection={moveSection}>
                    <Input
                      placeholder="Section Title"
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                      className="mb-2"
                    />
                    <textarea
                      placeholder="Section Content"
                      value={section.content}
                      onChange={(e) => updateSection(index, "content", e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                      rows="4"
                    />
                  </DraggableSection>
                ))}
                <Button onClick={addSection}>Add Section</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customize">
            <Card>
              <CardHeader>
                <CardTitle>Customize Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value) => setFontStyle(value)}>
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue placeholder="Select font style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="font-sans">Sans-serif</SelectItem>
                    <SelectItem value="font-serif">Serif</SelectItem>
                    <SelectItem value="font-mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFontSize(value)}>
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-sm">Small</SelectItem>
                    <SelectItem value="text-base">Medium</SelectItem>
                    <SelectItem value="text-lg">Large</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setAlignment(value)}>
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-left">Left</SelectItem>
                    <SelectItem value="text-center">Center</SelectItem>
                    <SelectItem value="text-right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-4">
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </div>
    </DndProvider>
  );
};

export default function App() {
  return <ResumeBuilder />;
}