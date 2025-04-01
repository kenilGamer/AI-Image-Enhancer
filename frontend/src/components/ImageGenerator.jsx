import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("logoHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://ai-image-enhancer-8rmp.onrender.com/api/generate-image", {
        prompt,
        n: 3,
        size: "1024x1024",
      });

      const generatedImages = response.data.images;
      setImages(generatedImages);

      // Save the generated logos to history
      const newEntry = {
        prompt,
        timestamp: new Date().toISOString(),
        images: generatedImages,
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("logoHistory", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setError("Failed to generate images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLogo = async (url, index) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "image/png" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `logo-${index + 1}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error saving logo:", err.message);
      alert("Failed to save the logo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
        AI Logo Generator
      </h1>
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-2xl">
        <textarea
          className="w-full p-4 text-gray-100 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 mb-6"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <button
          className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
          }`}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Logos"}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-700"
          >
            <img
              src={url}
              alt={`Generated Logo ${index + 1}`}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={url}
                download={`logo-${index + 1}.png`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-2"
              >
                Download
              </a>
              <button
                onClick={() => handleSaveLogo(url, index)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save Logo
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-5xl mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Logo Generation History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center">No history available.</p>
        ) : (
          <div className="space-y-8">
            {history.map((entry, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-sm text-gray-400 mb-2">
                  {/* <strong>Prompt:</strong> {entry.prompt} */}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  <strong>Generated on:</strong> {new Date(entry.timestamp).toLocaleString()}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {entry.images.map((url, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={url}
                      alt={`History Logo ${imgIndex + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;