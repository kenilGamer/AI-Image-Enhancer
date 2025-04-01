import fs from "fs";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const testingAPI = async (image,imageFilename) => {
  const client = new OpenAI({
    baseURL: 'https://beta.sree.shop/v1',
    apiKey: process.env.OPENAI_API_KEY  // Replace with your beta API key
  });
console.log("\n" + "=".repeat(60));
  console.log("🖼️  TEST: IMAGE GENERATION");
  console.log("=".repeat(60));

  const imagePrompt = `Generate a high-quality image of a futuristic city skyline at sunset, with flying cars and neon lights. The scene should be vibrant and colorful, showcasing advanced technology and architecture. The sky should be filled with clouds reflecting the sunset colors.`;

  try {
    const response = await client.images.generate({
      model: "Provider-5/flux-pro",
      prompt: imagePrompt, 
      n: 3,
      size: "1024x1024",
    });

   console.log();
   
// Print all image URLs
response.data.forEach((image, i) => {
  console.log(`Image ${i+1}: ${image.url}`);
});
    const imageUrl = response.data[0].url;

    // Download image from the URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(imageFilename, imageResponse.data);

    console.log(`✅ Image generated and saved as: ${imageFilename}`);
  } catch (error) {
    console.error(
      "❌ Error generating image:",
      error.response?.data || error.message
    );
  }
};

testingAPI("/public/wse.png",'./public/imaga1.png');