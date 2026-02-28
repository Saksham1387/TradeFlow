import { Handle, Position } from "@xyflow/react";
import type { TradingMetadata } from "common/types";

export const HyperLiquidTradeNode = ({
  data,
}: {
  data: {
    metadata: TradingMetadata;
  };
}) => {
  const isLong = data.metadata.type === "LONG";

  return (
    <div className="min-w-[180px] rounded-lg bg-card border border-border shadow-md overflow-hidden">
      <div className="px-3 py-2 bg-accent border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold text-foreground">Hyper Liquid</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Direction</span>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isLong ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
            {data.metadata.type}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Qty</span>
          <span className="text-xs text-foreground font-mono">{data.metadata.qty}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Asset</span>
          <span className="text-xs text-primary font-medium">{data.metadata.symbol}</span>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-card" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-card" />
    </div>
  );
};
