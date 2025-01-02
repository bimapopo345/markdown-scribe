import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              content: "You are a helpful assistant that converts text into well-formatted README.md content following standard README conventions. Include all necessary sections like Project Title, Description, Features, Installation, Usage, etc. Format the output in proper markdown.",
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">Text to README.md Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Text</label>
            <Textarea
              placeholder="Enter your text here..."
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
            <div>
              <label className="block text-sm font-medium mb-2">Generated README.md</label>
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