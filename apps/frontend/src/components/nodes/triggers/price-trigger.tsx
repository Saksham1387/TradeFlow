import { Handle, Position } from "@xyflow/react";
import type { PriceTriggerNodeMetadata } from "common/types";

export const PriceTrigger = ({
  data,
}: {
  data: {
    metadata: PriceTriggerNodeMetadata;
  };
  isConnectable: boolean;
}) => {
  return (
    <div className="min-w-[180px] rounded-lg bg-card border border-border shadow-md overflow-hidden">
      <div className="px-3 py-2 bg-accent border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-chart-4" />
        <span className="text-xs font-semibold text-foreground">Price Trigger</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Asset</span>
          <span className="text-xs text-primary font-medium">{data.metadata.assest}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</span>
          <span className="text-xs text-foreground font-mono">${data.metadata.amount?.toLocaleString()}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-card" />
    </div>
  );
};
