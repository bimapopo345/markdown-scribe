import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

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
              content: `You are a helpful assistant that converts text into well-formatted README.md content following professional README conventions. 
              
              Important formatting rules:
              1. Use proper markdown syntax with clear section hierarchy
              2. For any code blocks or commands, use triple backticks with the appropriate language specification
              3. For installation steps, always format commands like this:
                 \`\`\`bash
                 # Clone the repository
                 git clone <repository-url>
                 cd <project-name>

                 # Install dependencies
                 npm install
                 # or using pnpm
                 pnpm install

                 # Set up environment variables
                 cp .env.example .env

                 # Start development server
                 npm run dev
                 # or using pnpm
                 pnpm dev
                 \`\`\`
              4. For environment variables, use this format:
                 \`\`\`env
                 PORT=3000
                 MONGODB_URI=your_mongodb_connection_string
                 JWT_SECRET=your_jwt_secret
                 \`\`\`
              
              Always start with:
              1. A clear, descriptive title
              2. A comprehensive project description (3-4 paragraphs) that includes:
                 - What the project does
                 - Why it's useful
                 - Key features and benefits
                 - Target audience
                 - Technology highlights
              3. A detailed table of contents using markdown links
              
              Then include these essential sections:
              - Features and Functionality (with bullet points)
              - Technology Stack (categorized into Backend, Frontend, Other Tools)
              - Prerequisites
              - Detailed Installation Instructions (with code blocks)
              - Usage Guide
              - API Documentation (if applicable)
              - Deployment Instructions
              - Contributing Guidelines
              - License
              - Contact/Support Information
              
              Make the content comprehensive yet concise, and ensure all code blocks are properly formatted.
              
              For the Table of Contents, use this format:
              ## Table of Contents
              - [About](#about)
              - [Features](#features)
              - [Technology Stack](#technology-stack)
              - [Prerequisites](#prerequisites)
              - [Installation](#installation)
              - [Usage](#usage)
              - [API Documentation](#api-documentation)
              - [Deployment](#deployment)
              - [Contributing](#contributing)
              - [License](#license)
              - [Contact](#contact)`,
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
            Perfect for creating comprehensive documentation for your GitHub projects.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Text</label>
            <Textarea
              placeholder="Enter your project description here..."
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