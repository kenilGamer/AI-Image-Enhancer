import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://beta.sree.shop/v1", // Replace with the correct base URL
  apiKey: process.env.OPENAI_API_KEY, // Use your API key from the .env file
});

app.post("/api/generate-image", async (req, res) => {
  const { prompt, n = 3, size = "1024x1024" } = req.body;

  try {
    const response = await client.images.generate({
      model: "Provider-5/flux-pro", // Replace with the correct model
      prompt,
      n,
      size,
    });

    // Return the generated image URLs to the frontend
    res.json({ images: response.data.map((image) => image.url) });
  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate images" });
  }
});

// ── Image enhancement (upscaling) ──────────────────────────────────────────
// The provider key lives only on the server (ENHANCE_API_KEY). The browser sends the
// image here; this service forwards it and proxies the job status back.
const ENHANCE_API = "https://techhk.aoscdn.com/api/tasks/visual/scale";
const ENHANCE_API_KEY = process.env.ENHANCE_API_KEY;
const TASK_ID = /^[A-Za-z0-9_-]{1,128}$/;

app.post(
  "/api/enhance",
  express.raw({ type: ["image/*", "application/octet-stream"], limit: "15mb" }),
  async (req, res) => {
    if (!ENHANCE_API_KEY) return res.status(503).json({ error: "Image enhancement is not configured" });
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Send the image file as the request body" });
    }
    try {
      const form = new FormData();
      const type = req.get("content-type") || "application/octet-stream";
      form.append("image_file", new Blob([req.body], { type }), "upload");
      const upstream = await fetch(`${ENHANCE_API}/`, {
        method: "POST",
        headers: { "X-API-KEY": ENHANCE_API_KEY },
        body: form,
      });
      const json = await upstream.json().catch(() => null);
      const taskId = json?.data?.task_id;
      if (!upstream.ok || !taskId) {
        console.error("Enhance upload failed:", upstream.status, json?.message);
        return res.status(502).json({ error: "Upload to the enhancement service failed" });
      }
      res.json({ taskId });
    } catch (error) {
      console.error("Enhance upload error:", error.message);
      res.status(502).json({ error: "Upload to the enhancement service failed" });
    }
  },
);

app.get("/api/enhance/:taskId", async (req, res) => {
  if (!ENHANCE_API_KEY) return res.status(503).json({ error: "Image enhancement is not configured" });
  const { taskId } = req.params;
  if (!TASK_ID.test(taskId)) return res.status(400).json({ error: "Invalid task id" });
  try {
    const upstream = await fetch(`${ENHANCE_API}/${encodeURIComponent(taskId)}`, {
      headers: { "X-API-KEY": ENHANCE_API_KEY },
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok || !json?.data) {
      return res.status(502).json({ error: "Could not fetch the enhancement result" });
    }
    // Same shape the client already reads: { data: { state, image, ... } }
    res.json({ data: json.data });
  } catch (error) {
    console.error("Enhance status error:", error.message);
    res.status(502).json({ error: "Could not fetch the enhancement result" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});