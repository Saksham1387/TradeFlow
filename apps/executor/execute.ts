import type { EdgeDocument } from "common/types";
import { executeLighterNode } from "./executors/lighter-executor";

type NodeDocument = {
  id: string;
  type: string;
  position?:
    | {
        x: number;
        y: number;
      }
    | null
    | undefined;
  credentials?: any;
  data?:
    | {
        metadata?: any;
        kind?: "ACTION" | "TRIGGER" | null | undefined;
      }
    | null
    | undefined;
};

export async function execute(nodes: NodeDocument[], edges: EdgeDocument[]) {
  const trigger = nodes.find((x) => x.data?.kind === "TRIGGER");
  if (!trigger) {
    return;
  }

  await executeRecursive(trigger.id, nodes, edges);
}

async function executeRecursive(
  sourceId: string,
  nodes: NodeDocument[],
  edges: EdgeDocument[],
) {
  const nodesToExecute = edges
    .filter(({ source, target }) => source == sourceId)
    .map(({ target }) => target);

  await Promise.all(
    nodesToExecute.map(async (nodeClientId) => {
      const node = nodes.find(({ id }) => id === nodeClientId);
      if (!node) {
        return;
      }
      switch (node.type) {
        case "lighter":
          executeLighterNode(
            node.data?.metadata.symbol,
            node.data?.metadata.qty,
            node.data?.metadata.type,
          );
      }

      await Promise.all(
        nodesToExecute.map((id) => executeRecursive(id, nodes, edges)),
      );
    }),
  );
}
