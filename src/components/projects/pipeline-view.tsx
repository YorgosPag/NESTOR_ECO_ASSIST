"use client";

import type { Stage } from '@/lib/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { StageCard } from './stage-card';

export function PipelineView({ stages }: { stages: Stage[] }) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
      <div className="flex w-max space-x-4 p-4">
        {stages.map((stage, index) => (
          <StageCard key={stage.id} stage={stage} isFirst={index === 0} isLast={index === stages.length - 1} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
