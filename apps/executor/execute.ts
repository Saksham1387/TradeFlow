import type { EdgeDocument } from "common/types";
import { executeLighterNode } from "./executors/lighter-executor";
import { executeGmailAction } from "./executors/gmail-executor";

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

export async function execute(userId:string,nodes: NodeDocument[], edges: EdgeDocument[]) {
  const trigger = nodes.find((x) => x.data?.kind === "TRIGGER");
  if (!trigger) {
    return;
  }

  await executeRecursive(userId,trigger.id, nodes, edges);
}

async function executeRecursive(
  userId:string,
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

        case "gmail-action":
          executeGmailAction(
            node.data?.metadata.sendTo,
            node.data?.metadata.content,
            node.data?.metadata.subject,
            userId
        );
      }

      await Promise.all(
        nodesToExecute.map((id) => executeRecursive(userId,id, nodes, edges)),
      );
    }),
  );
}
