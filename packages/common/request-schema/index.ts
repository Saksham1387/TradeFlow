import z from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const SigninSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const NodeDataSchema = z.object({
  kind: z.enum(["ACTION", "TRIGGER"]),
  metadata: z.any(),
});

const WorkflowNodeSchema = z.object({
  position: PositionSchema,
  id: z.string(),
  credentials: z.any(),
  type:z.string(),
  data: NodeDataSchema,
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const CreateWorkflowSchema = z.object({
  edges: z.array(EdgeSchema).optional(),
  nodes: z.array(WorkflowNodeSchema).optional(),
});
