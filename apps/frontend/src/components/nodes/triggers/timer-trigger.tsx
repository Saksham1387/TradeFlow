import { Handle, Position } from "@xyflow/react";
import type { TimerTriggerNodeMetadata } from "common/types";

export const TimerTrigger = ({
  data,
}: {
  data: {
    metadata: TimerTriggerNodeMetadata;
  };
  isConnectable: boolean;
}) => {
  const formatInterval = (seconds: number) => {
    if (seconds >= 3600) return `${seconds / 3600}h`;
    if (seconds >= 60) return `${seconds / 60}m`;
    return `${seconds}s`;
  };

  return (
    <div className="min-w-[180px] rounded-lg bg-card border border-border shadow-md overflow-hidden">
      <div className="px-3 py-2 bg-accent border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-chart-4" />
        <span className="text-xs font-semibold text-foreground">Timer Trigger</span>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Interval</span>
          <span className="text-xs text-foreground font-mono">{formatInterval(data.metadata.time)}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-card" />
    </div>
  );
};
