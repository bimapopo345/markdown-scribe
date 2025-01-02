export const getMarkdownPrompt = () => `You are a helpful assistant that converts text into well-formatted README.md content following professional README conventions. 

Important formatting rules:
1. Use proper markdown syntax with clear section hierarchy
2. Each command should be in its own code block for easy copying, like this:

For cloning:
\`\`\`bash
git clone <repository-url>
\`\`\`

Change directory:
\`\`\`bash
cd <project-name>
\`\`\`

Install dependencies:
\`\`\`bash
npm install
\`\`\`
Or:
\`\`\`bash
pnpm install
\`\`\`

Start the application:
\`\`\`bash
npm start
\`\`\`
Or:
\`\`\`bash
pnpm start
\`\`\`

3. For environment variables, each one should be in its own block:
\`\`\`env
DATABASE_URL=your_database_url
\`\`\`

\`\`\`env
API_KEY=your_api_key
\`\`\`

Always include these sections in order:
1. Title (H1)
2. Project Overview (3-4 paragraphs explaining what the project does, its purpose, target audience, and key benefits)
3. Table of Contents (using proper markdown links)
   Example:
   ## Table of Contents
   - [About](#about)
   - [Features](#features)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Usage](#usage)
   - [API Documentation](#api-documentation)
   - [Contributing](#contributing)
   - [License](#license)
   - [Contact](#contact)

4. Features (bullet points)
5. Technology Stack (categorized by frontend, backend, etc.)
6. Prerequisites
7. Step-by-step Installation Instructions (with individual code blocks)
8. Usage Guide
9. API Documentation (if applicable)
10. Contributing Guidelines
11. License Information
12. Contact/Support Details

Make the content comprehensive yet concise, and ensure all code blocks are properly formatted for the specific technology being used.`;

<lov-write file_path="src/pages/Index.tsx">
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { getMarkdownPrompt } from "@/components/MarkdownPrompt";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputMarkdown, setOutputMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const convertToMarkdown = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://glhf.chat/api/openai/v1/chat/completions",
        {
          model: "hf:meta-llama/Llama-3.3-70B-Instruct",
          messages: [
            {
              role: "system",
              content: getMarkdownPrompt(),
            },
            {
              role: "user",
              content: inputText,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer glhf_ef882617166556f06dc68caa8cd36b75`,
            "Content-Type": "application/json",
          },
        }
      );

      const markdownContent = response.data.choices[0].message.content;
      setOutputMarkdown(markdownContent);
      toast({
        title: "Success",
        description: "Text successfully converted to markdown!",
      });
    } catch (error) {
      console.error("Error converting text:", error);
      toast({
        title: "Error",
        description: "Failed to convert text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputMarkdown);
      toast({
        title: "Copied!",
        description: "Markdown content copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">Text to README.md Converter</CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Transform your project description into a professional README.md file with proper formatting, 
            complete with table of contents, detailed sections, and properly formatted code blocks. 
            Each command block is individually copyable for easy setup. Perfect for creating comprehensive 
            documentation for any type of project, regardless of the technology stack used.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Text</label>
            <Textarea
              placeholder="Enter your project description here. Include key information like project purpose, features, technologies used, and any specific installation requirements..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <Button 
            onClick={convertToMarkdown} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Converting..." : "Convert to README.md"}
          </Button>
          {outputMarkdown && (
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Generated README.md</label>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Textarea
                value={outputMarkdown}
                readOnly
                className="min-h-[300px] font-mono"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;