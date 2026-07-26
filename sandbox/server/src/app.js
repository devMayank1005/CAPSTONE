import express from "express";
import morgan from "morgan";
import { v7 as uuid } from "uuid";
import { createPods } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/sandbox/health", (req, res) => {
  res.status(200).json({
    message: "Sandbox API is healthy",
    status: "ok",
  });
});

app.post("/api/sandbox/start", async (req, res) => {
  const sandboxId = uuid();

  try {
    await Promise.all([
      createPods(sandboxId),
      createService(sandboxId),
    ]);

    return res.status(200).json({
      message: "Sandbox started successfully",
      sandboxId,
      previewUrl: `http://${sandboxId}.preview.localhost`,
    });
  } catch (error) {
    console.error("Sandbox start failed:", error);
    return res.status(500).json({
      message: "Failed to start sandbox",
      sandboxId,
      error: error?.message || "Unknown error",
    });
  }
});

export default app;