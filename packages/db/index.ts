import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    requied: true,
  },
});

const EdgesSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const PositionSchema = new Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const NodeDataSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["ACTION", "TRIGGER"],
    },
    metadata: Schema.Types.Mixed,
  },
  {
    _id: false,
  },
);

const WorkflowNodesSchema = new Schema(
  {
    type:{
      type:String,
      required:true
    },
    position: PositionSchema,
    id: {
      type: String,
      required: true,
    },
    credentials: Schema.Types.Mixed,
    data: NodeDataSchema,
  },
  {
    _id: false,
  },
);


const OAuthTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  provider: {
    type:String,
    enum:["GOOGLE"]
  },           
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
});

const WorkflowSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  edges: {
    type: [EdgesSchema],
    default: [],
  },
  nodes: {
    type: [WorkflowNodesSchema],
    default: [],
  },
});

const CredentialsTypeSchema = new Schema(
  {
    title: { type: String, required: true },
    required: {
      type: Boolean,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const ExecutionSchema = new Schema({
  workflowId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Workflows",
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
  },
  startTime: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  endTime: {
    type: Date,
  },
});

export const UserModel = mongoose.model("Users", UserSchema);
export const WorkFlowModel = mongoose.model("Workflows", WorkflowSchema);
export const ExecutionModel = mongoose.model("Executions", ExecutionSchema);
export const OauthTokenModel = mongoose.model("OauthToken", OAuthTokenSchema);