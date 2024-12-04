import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button as ShadButton } from "@/components/ui/button";
import { jsPDF } from "jspdf";

function App() {
  const [userDetails, setUserDetails] = useState({
    name: '', email: '', phone: '', linkedin: '', website: ''
  });
  const [sections, setSections] = useState([{ title: '', content: '' }]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e, field) => {
    setUserDetails({ ...userDetails, [field]: e.target.value });
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const updateSection = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const moveSection = (from, to) => {
    const items = [...sections];
    const [removed] = items.splice(from, 1);
    items.splice(to, 0, removed);
    setSections(items);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(userDetails.name, 10, 10);
    doc.text(`${userDetails.email} | ${userDetails.phone}`, 10, 20);
    let y = 30;
    sections.forEach((section, index) => {
      doc.text(section.title, 10, y);
      y += 10;
      doc.text(section.content, 10, y);
      y += 10;
    });
    doc.save('resume.pdf');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input value={userDetails.name} onChange={(e) => handleChange(e, 'name')} placeholder="Name" />
            <Input value={userDetails.email} onChange={(e) => handleChange(e, 'email')} placeholder="Email" />
            <Input value={userDetails.phone} onChange={(e) => handleChange(e, 'phone')} placeholder="Phone" />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <Input value={userDetails.linkedin} onChange={(e) => handleChange(e, 'linkedin')} placeholder="LinkedIn Profile" />
            <Input value={userDetails.website} onChange={(e) => handleChange(e, 'website')} placeholder="Personal Website" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {sections.map((section, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle>Section {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input value={section.title} onChange={(e) => updateSection(index, 'title', e.target.value)} placeholder="Section Title" />
                  <textarea 
                    value={section.content} 
                    onChange={(e) => updateSection(index, 'content', e.target.value)} 
                    placeholder="Section Content" 
                    className="w-full p-2 mt-2 border rounded"
                  />
                  <Button onClick={() => moveSection(index, index > 0 ? index - 1 : index)}>Move Up</Button>
                  <Button onClick={() => moveSection(index, index < sections.length - 1 ? index + 1 : index)}>Move Down</Button>
                </CardContent>
              </Card>
            ))}
            <ShadButton onClick={addSection}>Add Section</ShadButton>
          </div>
        );
      case 3:
        return (
          <div>
            <Button onClick={generatePDF}>Download Resume as PDF</Button>
          </div>
        );
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>Previous</Button>
            <Button onClick={() => setCurrentStep(Math.min(3, currentStep + 1))} disabled={currentStep === 3}>Next</Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-center">
        Step {currentStep + 1} of 4
      </div>
    </div>
  );
}

export default App;