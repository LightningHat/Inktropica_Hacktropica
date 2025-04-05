import React, { useRef, useState, useEffect } from "react";
import Dropzone from "react-dropzone";

const HandwritingApp = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outputImageVisible, setOutputImageVisible] = useState(false);
  const [slant, setSlant] = useState(0);
  const [thickness, setThickness] = useState(2);
  const [spacing, setSpacing] = useState(1);

  // Drawing on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const startDrawing = ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
      if (!drawing) return;
      const { offsetX, offsetY } = nativeEvent;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      ctx.closePath();
      setDrawing(false);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [drawing]);

  const handleDrop = (acceptedFiles) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (imageFiles.length < acceptedFiles.length) {
      alert("Only image files are allowed.");
    }
    setUploadedFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleTrainModel = () => {
    if (uploadedFiles.length < 1) {
      alert("Please upload at least 1 image sample.");
      return;
    }
    alert("Model training started...");
    setTimeout(() => {
      alert("Model trained successfully!");
    }, 3000);
  };

  const handleConvertText = () => {
    if (!inputText.trim()) {
      alert("Please enter some text to convert.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOutputImageVisible(true);
    }, 2000);
  };

  const handleClearText = () => {
    setInputText("");
    setOutputImageVisible(false);
  };

  return (
    <div className="app-container flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="sidebar w-full md:w-1/4 bg-white border-r p-4">
        <h3 className="text-lg font-bold mb-4">Your Handwriting</h3>

        {/* Drawing Canvas */}
        <div className="canvas-section mb-6">
          <h4 className="font-semibold mb-2">Write a Paragraph (Canvas)</h4>
          <canvas
            ref={canvasRef}
            width={300}
            height={200}
            className="border border-gray-400 rounded w-full"
          ></canvas>
          <button
            className="mt-2 text-sm text-red-600 underline"
            onClick={handleClearCanvas}
          >
            Clear Canvas
          </button>
        </div>

        {/* Upload Image via Dropzone */}
        <div className="upload-section mb-6">
          <h4 className="font-semibold mb-2">Upload Handwritten Image</h4>
          <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="upload-area border-2 border-dashed p-4 text-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <p>Drag & drop or click to upload images</p>
              </div>
            )}
          </Dropzone>
          <div className="uploaded-files mt-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="file-item flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
              >
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary w-full bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleTrainModel}
        >
          Train Model
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow p-6">
        <div className="app-header text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Convert Your Text to Handwriting
          </h2>
          <p className="text-gray-500">
            Type your text below and see it transformed into your handwriting
            style.
          </p>
        </div>

        <div className="text-input-section mb-6">
          <textarea
            className="w-full border p-4 rounded mb-4"
            rows="5"
            placeholder="Type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <div className="text-controls flex justify-end space-x-4">
            <button
              className="btn-primary bg-indigo-600 text-white px-4 py-2 rounded"
              onClick={handleConvertText}
            >
              Convert to Handwriting
            </button>
            <button
              className="btn-secondary border border-indigo-600 text-indigo-600 px-4 py-2 rounded"
              onClick={handleClearText}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="output-section bg-white p-6 rounded shadow">
          <div className="output-header flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Your Handwritten Text</h3>
            <div className="style-controls flex space-x-4">
              <div>
                <label className="text-sm text-gray-500">Slant</label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={slant}
                  onChange={(e) => setSlant(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Thickness</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Spacing</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.1"
                  value={spacing}
                  onChange={(e) => setSpacing(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="output-preview flex justify-center items-center h-64">
            {isLoading ? (
              <div className="text-center">
                <div className="spinner border-4 border-indigo-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-gray-500 mt-2">Generating handwriting...</p>
              </div>
            ) : outputImageVisible ? (
              <img
                id="outputImage"
                src="images/sample-handwriting.png"
                alt="Handwriting Output"
                className="max-w-full max-h-full"
                style={{
                  transform: `skewX(${slant}deg)`,
                  filter: `contrast(${thickness})`,
                  letterSpacing: `${spacing}px`,
                }}
              />
            ) : (
              <div className="text-gray-500 text-center">
                <i className="fas fa-pen-fancy text-4xl mb-2"></i>
                <p>Your handwritten text will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandwritingApp;
