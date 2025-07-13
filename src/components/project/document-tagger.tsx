"use client";

import { useState } from "react";
import { suggestDocumentTags } from "@/ai/flows/suggest-document-tags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Tags, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function DocumentTagger() {
  const [filename, setFilename] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSuggestTags = async () => {
    if (!filename || !summary) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a filename and summary to suggest tags.",
      });
      return;
    }
    setIsLoadingTags(true);
    setTags([]);
    try {
      const result = await suggestDocumentTags({
        filename: filename,
        contentSummary: summary,
      });
      setTags(result.tags);
    } catch (error) {
      console.error("Failed to suggest tags:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not suggest tags. Please try again later.",
      });
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleUpload = async () => {
    // This is a placeholder for actual upload logic
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
    setIsUploading(false);
    toast({
        title: "File Uploaded",
        description: `${filename} has been successfully uploaded with tags: ${tags.join(', ')}`,
    });
    // Reset form
    setFilename("");
    setSummary("");
    setTags([]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Upload a new document and get AI-powered tag suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">File</Label>
          <Input id="file-upload" type="file" onChange={(e) => setFilename(e.target.files?.[0]?.name || "")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file-summary">Content Summary</Label>
          <Textarea
            id="file-summary"
            placeholder="Briefly describe the document's content..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <Button onClick={handleSuggestTags} disabled={isLoadingTags || !filename || !summary} variant="outline" className="w-full">
          {isLoadingTags ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Tags className="mr-2 h-4 w-4" />
          )}
          Suggest Tags
        </Button>

        {tags.length > 0 && (
            <div className="space-y-2 rounded-lg border p-4">
                <h4 className="font-medium">Suggested Tags:</h4>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </div>
        )}

        <Button onClick={handleUpload} disabled={isUploading || !filename} className="w-full">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Document
        </Button>
      </CardContent>
    </Card>
  );
}
