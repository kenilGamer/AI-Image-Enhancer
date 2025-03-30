import Loading from "./Loading";

function ImagePreview(props) {
  return (
    <div className="w-full flex items-center justify-center gap-5 p-5 ">
      {/* Original Image Section */}
      <div className="bg-white shadow-xl rounded-2xl w-full min-h-80">
        <h1 className="text-xl font-bold bg-gray-800 text-white p-2 rounded-xl">
          Original Image
        </h1>
        {props.uploadimga ? (
          <img
            src={props.uploadimga}
            alt="Original"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center flex items-center justify-center h-80 bg-gray w-full">
            No image selected
          </div>
        )}
      </div>

      {/* Enhanced Image Section */}
      <div className="bg-white shadow-xl rounded-2xl w-full min-h-80">
        <h1 className="text-xl font-bold bg-gray-800 text-white p-2 rounded-xl">
          Enhanced Image
        </h1>
        {props.loading ? (
          <div className="text-center flex items-center justify-center h-80 bg-gray w-full">
            <Loading />
          </div>
        ) : props.enhancedImage ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={props.enhancedImage.image}
              alt="Enhanced"
              className="w-full h-full object-cover mb-4"
            />
            <a
              href={props.enhancedImage.image}
              download="enhanced-image.jpg"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Download Enhanced Image
            </a>
          </div>
        ) : (
          <div className="text-center flex items-center justify-center h-80 w-full">
            No enhanced image selected
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePreview;