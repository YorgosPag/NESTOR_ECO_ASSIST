"use client";

import type { ProjectFile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, GripVertical } from 'lucide-react';
import { getFileIcon } from '@/components/icons';

export function FileItem({ file }: { file: ProjectFile }) {
  const Icon = getFileIcon(file.type);

  return (
    <div className="group flex items-center justify-between gap-2 rounded-md border p-2 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-2 truncate">
        <Icon className="size-6 shrink-0 text-muted-foreground" />
        <div className="truncate">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {file.size} - {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Download className="size-4" />
      </Button>
    </div>
  );
}
