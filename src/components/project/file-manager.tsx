"use client";

import type { Stage, File as ProjectFile } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { DocumentTagger } from "./document-tagger";

type FileManagerProps = {
  stage: Stage;
};

export function FileManager({ stage }: FileManagerProps) {
  const files: ProjectFile[] = stage.files || [];

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>{stage.title} Files</CardTitle>
                <CardDescription>Documents and attachments for this stage.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {files.length > 0 ? (
                        files.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell className="font-medium">{file.name}</TableCell>
                            <TableCell>{file.size}</TableCell>
                            <TableCell>{file.uploadedAt}</TableCell>
                            <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No files uploaded for this stage yet.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <DocumentTagger />
        </div>
    </div>
  );
}
