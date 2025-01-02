export const getMarkdownPrompt = () => `
You are a helpful assistant that converts text into a well-formatted README.md document following professional conventions.

## Penting:
1. **Gunakan sintaks Markdown** dengan struktur judul dan subjudul yang rapi.
2. **Pisahkan setiap perintah dalam blok kode terpisah** agar mudah disalin.
3. **Berikan penjelasan singkat di setiap poin** (misalnya di Features, Technology Stack, Usage Guide, API Documentation, dsb.) agar README.md lebih informatif.
4. **Selalu sertakan struktur folder** (jika disediakan di input) dalam satu blok kode khusus agar pembaca tahu di mana menempatkan file atau menemukan file tertentu.
5. **Jangan lupa menambahkan contoh Environment Variables** dalam blok \`\`\`env\`\`\` terpisah, jika di proyeknya ada variabel lingkungan.
6. **Selalu sertakan Usage Guide** dan **API Documentation** (jika ada API), dengan penjelasan singkat dan contoh endpoint/blok kode yang relevan.

## Urutan Bagian Wajib dalam README:

1. **Title (H1)**
   - Judul utama proyek

2. **Project Overview (3–4 paragraf)**
   - Deskripsi tentang apa yang dilakukan proyek
   - Tujuan, audiens, dan manfaat utama

3. **Table of Contents**
   - Susun dengan tautan internal ke setiap bagian:
     \`\`\`md
     ## Table of Contents
     - [About](#about)
     - [Features](#features)
     - [Technology Stack](#technology-stack)
     - [Prerequisites](#prerequisites)
     - [Installation](#installation)
     - [Usage Guide](#usage-guide)
     - [API Documentation](#api-documentation)
     - [Contributing Guidelines](#contributing-guidelines)
     - [License](#license)
     - [Contact/Support Information](#contactsupport-information)
     \`\`\`

4. **Features**
   - Gunakan bullet points dan berikan kalimat penjelas di setiap fitur

5. **Technology Stack**
   - Pisahkan per kategori, misalnya: Frontend, Backend, Database, dsb.
   - Berikan keterangan singkat per teknologi

6. **Prerequisites**
   - Berisi software apa saja yang dibutuhkan sebelum instalasi (Node, npm, pnpm, dsb.)

7. **Step-by-step Installation Instructions**
   - Gunakan blok kode \`\`\`bash\`\`\` atau \`\`\`powershell\`\`\` di setiap langkah (clone repo, install dependencies, setup environment, dsb.)

8. **Usage Guide**
   - Sertakan contoh cara menjalankan aplikasi, serta penjelasan singkat bagaimana penggunaannya
   - Jika memerlukan environment variable, sertakan di blok \`\`\`env\`\`\`

9. **API Documentation** (Jika Ada)
   - Paparkan endpoints, metode HTTP, dan contoh request/response (dalam blok kode)
   - Berikan penjelasan singkat di setiap endpoint

10. **Contributing Guidelines**
    - Jelaskan cara kontribusi (fork, branch, pull request, dsb.)

11. **License Information**
    - Sebutkan lisensi, misalnya MIT, Apache, dsb.

12. **Contact/Support Details**
    - Sertakan info kontak atau link dukungan

---
`;

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