import React, { useState } from "react";

const HandwritingApp = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outputImageVisible, setOutputImageVisible] = useState(false);
  const [slant, setSlant] = useState(0);
  const [thickness, setThickness] = useState(2);
  const [spacing, setSpacing] = useState(1);

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.match("image.*")
    );
    if (validFiles.length !== files.length) {
      alert("Please upload image files only.");
    }
    setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleTrainModel = () => {
    if (uploadedFiles.length < 3) {
      alert("Please upload at least 3 handwriting samples.");
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

  const applyStyleAdjustments = () => {
    const outputImage = document.getElementById("outputImage");
    if (outputImage) {
      outputImage.style.transform = `skewX(${slant}deg)`;
      outputImage.style.filter = `contrast(${thickness})`;
      outputImage.style.letterSpacing = `${spacing}px`;
    }
  };

  return (
    <div className="app-container flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="sidebar w-full md:w-1/4 bg-white border-r p-4">
        <h3 className="text-lg font-bold mb-4">Your Handwriting</h3>
        <div className="upload-section mb-6">
          <h4 className="font-semibold mb-2">Upload Samples</h4>
          <p className="text-sm text-gray-500 mb-4">
            Upload at least 3 samples of your handwriting.
          </p>
          <div
            className="upload-area border-2 border-dashed p-4 text-center cursor-pointer"
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <i className="fas fa-cloud-upload-alt text-indigo-600 text-2xl mb-2"></i>
            <p>Drag & drop files here or</p>
            <button className="upload-btn bg-indigo-600 text-white px-4 py-2 rounded">
              Browse Files
            </button>
            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
          <div className="uploaded-files mt-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="file-item flex items-center justify-between p-2 bg-gray-100 rounded mb-2"
              >
                <span className="file-name text-sm truncate">{file.name}</span>
                <i
                  className="fas fa-times text-red-500 cursor-pointer"
                  onClick={() => handleFileRemove(index)}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn-primary w-full bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleTrainModel}
          disabled={uploadedFiles.length < 3}
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
              <div className="control-group">
                <label className="text-sm text-gray-500">Slant</label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={slant}
                  onChange={(e) => setSlant(e.target.value)}
                />
              </div>
              <div className="control-group">
                <label className="text-sm text-gray-500">Thickness</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                />
              </div>
              <div className="control-group">
                <label className="text-sm text-gray-500">Spacing</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  value={spacing}
                  onChange={(e) => setSpacing(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="output-preview flex justify-center items-center h-64">
            {isLoading ? (
              <div className="loading-indicator text-center">
                <div className="spinner border-4 border-indigo-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-gray-500 mt-2">Generating your handwriting...</p>
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
              <div className="placeholder-message text-center text-gray-500">
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