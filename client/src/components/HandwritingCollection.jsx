// src/components/HandwritingCollection.jsx
import React, { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import axios from "axios";

const HandwritingCollection = () => {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const fileInputRef = useRef();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleSubmitCanvas = async () => {
    const strokeData = lines.map(line => line.points);
    await axios.post("http://localhost:8000/save-strokes", { strokes: strokeData });
    alert("Canvas strokes submitted!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmitImage = async () => {
    const formData = new FormData();
    formData.append("file", uploadedImage);

    await axios.post("http://localhost:8000/upload-handwriting", formData);
    alert("Image uploaded for preprocessing!");
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Handwriting Data Collection</h1>

      <div>
        <h2 className="font-semibold mb-2">Option 1: Write on Canvas</h2>
        <div className="border border-gray-300 rounded shadow">
          <Stage
            width={600}
            height={300}
            className="bg-white"
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="black"
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                />
              ))}
            </Layer>
          </Stage>
        </div>
        <div className="space-x-2 mt-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmitCanvas}>
            Submit Strokes
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleClear}>
            Clear Canvas
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2 mt-4">Option 2: Upload Handwriting Image</h2>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
        {previewImage && (
          <div className="mt-2">
            <img src={previewImage} alt="Preview" className="w-64 border rounded" />
          </div>
        )}
        <button className="px-4 py-2 bg-green-600 text-white rounded mt-2" onClick={handleSubmitImage}>
          Submit Image
        </button>
      </div>
    </div>
  );
};

export default HandwritingCollection;
