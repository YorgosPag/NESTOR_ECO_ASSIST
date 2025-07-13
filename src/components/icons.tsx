"use client";

import { FileText, FileCode, FileImage, FileSpreadsheet, File as FileIcon } from "lucide-react";

export const Icons = {
  pdf: FileText,
  word: FileCode,
  image: FileImage,
  excel: FileSpreadsheet,
  default: FileIcon,
};

export function getFileIcon(type: 'PDF' | 'Word' | 'Image' | 'Excel'): React.ComponentType<{ className?: string }> {
  switch (type) {
    case 'PDF':
      return Icons.pdf;
    case 'Word':
      return Icons.word;
    case 'Image':
      return Icons.image;
    case 'Excel':
      return Icons.excel;
    default:
      return Icons.default;
  }
}
