import React, { useState } from "react";
import ImagePreview from "./ImagePreview";
import ImageUpload from "./ImageUpload";
import { enhancedImageApi } from "../utils/enhanceImageApi";

function Home() {
  const [uploadimga, setuploadimga] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadHandler = async (file) => {
    setuploadimga(URL.createObjectURL(file));
    setLoading(true);
    // call api
    try {
      const enhancedUrl = await enhancedImageApi(file)
      console.log(enhancedUrl);
      
      setEnhancedImage(enhancedUrl); 
      setLoading(false);
    } catch (error) {
      console.log(error);
      
    }

  }
  return (
    <div className="w-full">
      <ImageUpload uploadHandler={uploadHandler} />
      <ImagePreview
        uploadimga={uploadimga}
        enhancedImage={enhancedImage}
        loading={loading}
      />
    </div>
  );
}

export default Home;
