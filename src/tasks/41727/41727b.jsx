import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarkdownPreview = ({ html }) => (
  <div
    className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
    <code className="text-sm">{code}</code>
  </pre>
);

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  const convertToHtml = () => {
    // This is a simple markdown to HTML converter
    // In a real app, you'd use a proper markdown library
    const converted = markdown
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>");

    setHtml(converted);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Markdown to HTML Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your markdown here..."
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={convertToHtml} className="w-full">
              Convert to HTML
            </Button>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownPreview html={html} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="html" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>HTML Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock code={html} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}