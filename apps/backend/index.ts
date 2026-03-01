import { CreateWorkflowSchema, SigninSchema, SignupSchema } from "common/types";
import { ExecutionModel, OauthTokenModel, UserModel, WorkFlowModel } from "db/client";
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

app.get("/workflows", middleware, async (req, res) => {
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
});

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

app.get("/executions/:id", middleware, async (req, res) => {
  const workflowId = req.params.id;

  try {
    const executions = await ExecutionModel.find({
      workflowId: workflowId,
    });

    if (!executions) {
      res.status(404).json({
        message: "Executions Not Found",
      });
      return;
    }

    res.status(200).json({
      data: {
        executions,
      },
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
    });
    return;
  }
});

app.get("/auth/google", async (req, res) => {
  const token = req.query.token as string;

  let userId: string;
  try {
    const decoded = jwt.verify(token, "secret") as { id: string };
    userId = decoded.id;
  } catch {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
    res.status(500).json({ message: "Missing GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI env vars" });
    return;
  }

  const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send",
    access_type: "offline",
    prompt: "consent",
    state: userId,
  });

  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
});

app.get("/auth/google/status", middleware, async (req ,res ) => {
  const oauth = await OauthTokenModel.findOne({
    userId:req.userId
  })

  if(!oauth) {
    res.status(200).json({
      message:"Oauth does not exist for this user",
      data:{
        oauth:false
      }
    })

    return 
  }

  res.status(200).json({
    message:"Oauth exists",
    data:{
      oauth:true,
    }
  })
})


app.get("/auth/google/callback", async (req, res) => {
  const { code, state: userId } = req.query;

  // 1. Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const { access_token, refresh_token, expires_in } = await tokenRes.json();

  // 2. Save to DB
  await OauthTokenModel.findOneAndUpdate(
    { userId, provider: "GOOGLE" },
    {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    },
    { upsert: true }   // create if doesn't exist, update if it does
  );

  // 3. Redirect back to frontend
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?gmail=connected`);
});


app.listen(2000);
