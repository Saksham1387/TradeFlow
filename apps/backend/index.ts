import { CreateWorkflowSchema, SigninSchema, SignupSchema } from "common/types";
import { UserModel, WorkFlowModel } from "db/client";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { middleware } from "./middleware";
import cors from "cors";

mongoose.connect(process.env.MONGO_URL!);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedBody = SignupSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(403).json({
      message: "Invalid Input",
    });
    return;
  }

  const user = await UserModel.create({
    username: parsedBody.data.username,
    password: parsedBody.data.password,
  });

  res.status(200).json({
    message: "Signed Up successfully",
    data: {
      user,
    },
  });
});

app.post("/signin", async (req, res) => {
  const parsedBody = SigninSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(403).json({
      message: "Invalid Input",
    });
    return;
  }

  const exisintgUser = await UserModel.findOne({
    username: parsedBody.data.username,
  });

  if (!exisintgUser) {
    res.status(404).json({
      message: "User does not exist",
    });
    return;
  }

  if (exisintgUser.password !== parsedBody.data.password) {
    res.status(404).json({
      message: "Incorrect Password",
    });
    return;
  }

  const token = jwt.sign({ id: exisintgUser.id }, "secret");

  res.status(200).json({
    message: "Successfully Signed In",
    data: {
      token,
    },
  });
});

app.post("/workflow", middleware, async (req, res) => {
  const parsedBody = CreateWorkflowSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(403).json({
      message: "Invalid Input",
    });
    return;
  }

  try {
    const workflow = await WorkFlowModel.create({
      nodes: parsedBody.data.nodes,
      edges: parsedBody.data.edges,
      userId: req.userId,
    });

    res.status(200).json({
      message: "Workflow Created Succesully",
      data: {
        workflow,
      },
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(404).json({
      message: " Failed to create the workflow",
    });

    return;
  }
});

app.get("/workflows",middleware , async(req ,res ) => {
  try {
    const existingworkflows = await WorkFlowModel.find({
      userId: req.userId,
    });

    if (!existingworkflows) {
      res.status(404).json({
        message: "Workflows Not Found",
      });
      return;
    }

    res.status(200).json({
      data: {
        existingworkflows,
      },
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
    });
    return;
  }
})



app.get("/workflow/:id", middleware, async (req, res) => {
  const workflowId = req.params.id;
  try {
    const existingworkflow = await WorkFlowModel.findOne({
      _id: workflowId,
    });

    if (!existingworkflow) {
      res.status(404).json({
        message: "Workflow Not Found",
      });
      return;
    }

    res.status(200).json({
      data: {
        existingworkflow,
      },
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
    });
    return;
  }
});

app.get("/executions/:id", middleware, async (req, res) => {});

app.listen(2000);
