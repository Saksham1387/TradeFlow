import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Edge,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import { TriggerSheet } from "@/components/trigger-sheet";
import { PriceTrigger } from "@/components/nodes/triggers/price-trigger";
import { TimerTrigger } from "@/components/nodes/triggers/timer-trigger";
import { ActionSheet } from "@/components/ action-sheet";
import { LighterTradeNode } from "@/components/nodes/actions/lighter";
import { BackpackTradeNode } from "@/components/nodes/actions/backpack";
import { HyperLiquidTradeNode } from "@/components/nodes/actions/hyper-liquid";
import { GmailActionNode } from "@/components/nodes/actions/gmail";
import { useCreateWorkflow, useGetWorkflow } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const nodeTypes = {
  "price-trigger": PriceTrigger,
  "timer-trigger": TimerTrigger,
  lighter: LighterTradeNode,
  backpack: BackpackTradeNode,
  "hyper-liquid": HyperLiquidTradeNode,
  "gmail-action": GmailActionNode,
};
export type Nodekind =
  | "price-trigger"
  | "timer-trigger"
  | "hyperliquid"
  | "backpack"
  | "lighter"
  | "gmail-action";

export type NodeMetadata = any;

interface NodeType {
  type: Nodekind;
  data: {
    kind: "TRIGGER" | "ACTION";
    metadata: NodeMetadata;
  };
  credentials?: Record<string, unknown>;
  id: string;
  position: { x: number; y: number };
}

export const CreateFlowPage = ({ workflowId }: { workflowId?: string }) => {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectAction, setSelectAction] = useState<{
    position: {
      x: number;
      y: number;
    };
    startingNodeId: string;
  } | null>(null);
  const [loaded, setLoaded] = useState(!workflowId);

  const navigate = useNavigate();
  const createWorkflow = useCreateWorkflow();
  const existingWorkflow = useGetWorkflow(workflowId ?? "");

  useEffect(() => {
    if (existingWorkflow.data && !loaded) {
      const wf = existingWorkflow.data.data.existingworkflow;
      if (wf.nodes) setNodes(wf.nodes);
      if (wf.edges) setEdges(wf.edges);
      setLoaded(true);
    }
  }, [existingWorkflow.data, loaded]);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const onConnectEnd = useCallback((params: any, connectionInfo: any) => {
    if (!connectionInfo.isValid) {
      setSelectAction({
        startingNodeId: connectionInfo.fromNode.id,
        position: connectionInfo.to,
      });
    }
  }, []);

  const handleSave = async () => {
    try {
      const nodesToSend = nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: {
          x: n.position.x,
          y: n.position.y,
        },
        credentials: n.credentials,
        data: n.data,
      }));
      await createWorkflow.mutateAsync({ nodes: nodesToSend, edges });
      navigate({ to: "/dashboard" });
    } catch {
      // error handled by mutation
    }
  };

  if (workflowId && existingWorkflow.isLoading) {
    return (
      <div className="w-screen h-screen bg-background flex items-center justify-center">
        <svg className="animate-spin h-6 w-6 text-muted-foreground" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-background relative">
      <div className="absolute top-0 left-0 right-0 h-12 z-10 flex items-center justify-between px-4 bg-card border-b border-border">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-7 h-7 rounded-md bg-secondary border border-border flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-foreground">
            {workflowId ? "Edit Workflow" : "New Workflow"}
          </span>
        </div>
        {nodes.length > 0 && (
          <Button
            onClick={handleSave}
            disabled={createWorkflow.isPending}
            className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-colors cursor-pointer"
          >
            {createWorkflow.isPending ? "Saving..." : "Save Workflow"}
          </Button>
        )}
      </div>

      <div className="absolute inset-0 pt-12">
        {!nodes.length && !workflowId && (
          <TriggerSheet
            onSelect={(type, metadata) => {
              setNodes([
                ...nodes,
                {
                  type,
                  id: Math.random().toString(),
                  data: {
                    kind: "TRIGGER",
                    metadata,
                  },
                  position: {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                  },
                },
              ]);
            }}
          />
        )}

        {selectAction && (
          <ActionSheet
            onSelect={(type, metadata, credentials) => {
              const nodeId = Math.random().toString();
              setNodes([
                ...nodes,
                {
                  type,
                  id: nodeId,
                  data: {
                    kind: "ACTION",
                    metadata,
                  },
                  credentials,
                  position: selectAction.position,
                },
              ]);

              setEdges([
                ...edges,
                {
                  id: Math.random().toString(),
                  source: selectAction.startingNodeId,
                  target: nodeId,
                },
              ]);

              setSelectAction(null);
            }}
          />
        )}
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onConnectEnd={onConnectEnd}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="oklch(0.3 0.005 260)"
          />
          <Controls
            className="!bg-card !border-border !rounded-lg !shadow-md [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-muted-foreground [&>button:hover]:!bg-accent"
          />
        </ReactFlow>
      </div>
    </div>
  );
};
