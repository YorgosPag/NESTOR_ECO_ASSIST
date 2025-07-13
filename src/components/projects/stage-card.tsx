"use client";

import type { Stage } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileItem } from './file-item';
import { FileUploadDialog } from './file-upload-dialog';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

export function StageCard({ stage, isFirst, isLast }: { stage: Stage, isFirst: boolean, isLast: boolean }) {
  const getStatusIcon = () => {
    switch (stage.status) {
      case 'Completed':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="size-4 text-blue-600" />;
      default:
        return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative flex items-center">
      <Card className="w-80 min-h-[20rem] flex flex-col shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>{stage.name}</span>
            <Badge variant={stage.status === 'Completed' ? 'default' : 'secondary'} className="capitalize">
              {stage.status}
            </Badge>
          </CardTitle>
           <div className="flex items-center text-xs text-muted-foreground pt-1">
              <Calendar className="mr-1.5 size-3.5" />
              Deadline: {new Date(stage.deadline).toLocaleDateString()}
            </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-grow p-4">
          <div className="space-y-2">
            {stage.files.length > 0 ? (
              stage.files.map((file) => <FileItem key={file.id} file={file} />)
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No files uploaded.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <FileUploadDialog />
        </CardFooter>
      </Card>
      {!isLast && <div className="h-px w-8 bg-border ml-4" />}
    </div>
  );
}
