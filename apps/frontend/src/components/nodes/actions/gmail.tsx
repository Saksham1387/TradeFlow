import { Handle, Position } from "@xyflow/react";
import type { GmailActionMetadata } from "common/types";

export const GmailActionNode = ({
  data,
}: {
  data: {
    metadata: GmailActionMetadata;
  };
}) => {
  return (
    <div className="min-w-[180px] rounded-lg bg-card border border-border shadow-md overflow-hidden">
      <div className="px-3 py-2 bg-accent border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold text-foreground">Gmail</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">To</span>
          <span className="text-xs text-foreground font-mono truncate max-w-[110px]">{data.metadata.sendTo || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Subject</span>
          <span className="text-xs text-foreground truncate max-w-[110px]">{data.metadata.subject || "—"}</span>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-card" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-card" />
    </div>
  );
};
