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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});