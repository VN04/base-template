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
  <textarea
    value={code}
    readOnly
    className="w-full h-64 bg-gray-100 p-4 rounded-md overflow-x-auto text-base font-mono text-gray-800 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
  />
);

const parseMarkdown = (markdown) => {
    let html = markdown;
  
    // Headers
    html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
    html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
    html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
    // Bold, Italic, and Strikethrough
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
    
    // Handle Lists
  html = html.replace(
    /^(\s*\d+\.\s.+?)(?=\n(?!\s*\d+\.\s)|\n\n|\s*$)/gms,
    (match) => {
      const items = match
        .split(/\n+/)
        .map((item) => item.replace(/^\s*\d+\.\s(.+)/, "<li>$1</li>"))
        .join("");
      return `<ol>${items}</ol>`;
    }
  );

  html = html.replace(
    /^(\s*[-*]\s.+?)(?=\n(?!\s*[-*]\s)|\n\n|\s*$)/gms,
    (match) => {
      const items = match
        .split(/\n+/)
        .map((item) => item.replace(/^\s*[-*]\s(.+)/, "<li>$1</li>"))
        .join("");
      return `<ul>${items}</ul>`;
    }
  );
  
    
    // Code Blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
      });
  
    // Inline Code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
    
  
    // Line Breaks
    html = html.replace(/\n{2,}/g, "<br><br>");
    html = html.replace(/\n/g, "<br>");
  
    return html;
  };
  
  
  
  

  export default function App() {
    const [markdown, setMarkdown] = useState("");
    const [html, setHtml] = useState("");
  
    const convertToHtml = () => {
      const convertedHtml = parseMarkdown(markdown);
      setHtml(convertedHtml);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
        <Card className="max-w-4xl mx-auto shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center text-blue-600">
              Markdown to HTML Converter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Textarea
                placeholder="Enter your markdown here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[200px] border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <Button
                onClick={convertToHtml}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Convert to HTML
              </Button>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="preview"
                    className="py-2 text-center text-sm font-medium bg-gray-100 border-b-2 border-blue-600 focus:ring focus:ring-blue-300"
                  >
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="html"
                    className="py-2 text-center text-sm font-medium bg-gray-100 border-b-2 border-transparent hover:border-blue-600 transition focus:ring focus:ring-blue-300"
                  >
                    HTML
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <Card className="shadow-md rounded-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MarkdownPreview html={html} />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="html" className="mt-4">
                  <Card className="shadow-md rounded-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        HTML Output
                      </CardTitle>
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
  
