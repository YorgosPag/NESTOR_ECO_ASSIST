"use client";

import { useState } from 'react';
import { getDocumentTags } from '@/ai/flows/document-tagging';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FileUploadDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSuggestedTags([]);

    if (file.type.startsWith('text/')) {
        setIsLoading(true);
        try {
            const content = await file.text();
            const result = await getDocumentTags({ documentContent: content });
            setSuggestedTags(result.suggestedTags);
        } catch (error) {
            console.error('Error getting tags:', error);
            toast({
                variant: 'destructive',
                title: 'AI Tagging Failed',
                description: 'Could not generate tags for this file.',
            });
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleUpload = () => {
    // Simulate upload
    toast({
        title: 'Upload Successful',
        description: `${fileName} has been uploaded.`,
    });
    setOpen(false);
    setFileName('');
    setSuggestedTags([]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 size-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Attach a new document to this stage. AI will suggest tags for text files.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document">Document</Label>
            <Input id="document" type="file" onChange={handleFileChange} />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p>AI is analyzing your document...</p>
            </div>
          )}
          {suggestedTags.length > 0 && (
             <div className="space-y-2">
                <Label className="flex items-center gap-2"><Tag className="size-4" /> AI Suggested Tags</Label>
                <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={!fileName}>Upload File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
