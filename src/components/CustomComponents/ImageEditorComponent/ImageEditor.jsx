import React, { useState, useCallback } from "react";
import CustomButton from "../CustomButton/CustomButton";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/CropImage.js"; // Utility function to get cropped image

const ImageEditor = ({ onSave }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // State for crop position
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // Cropped area in pixels
  const [croppedImage, setCroppedImage] = useState(null);
  const [upFile, setUpFile] = useState(null);
  const handleImageUpload = (e) => {
    e?.stopPropagation()
    const file = e.target.files[0];
    setUpFile(file);
    console.log("file", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value));
  };

  const handleRotationChange = (e) => {
    setRotation(Number(e.target.value));
  };

  const onCropChange = useCallback((crop) => {
    setCrop(crop); // Update crop position
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels); // Update cropped area in pixels
  }, []);

  const saveCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      const file1 = new File([croppedBlob], upFile.name, {
        type: croppedBlob.type,
      });

      onSave(file1);
      console.log("Cropped image file:", file1);
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  }, [croppedAreaPixels, imageSrc, rotation, onSave, upFile]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Image Canvas */}
      <div
        style={{
          margin: "20px 0",
          display: "inline-block",
          position: "relative",
          width: "50%",
          height: "300px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom} // Update zoom on mouse wheel
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      {/* Controls & Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "40%",
          paddingLeft: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: "20px" }}
          onClick={(e) => e.stopPropagation()}
        />
        <div style={{ marginBottom: "20px" }} onClick={(e) => e.stopPropagation()}>
          <label>
            Zoom:
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={handleZoomChange}
              style={{ margin: "0 10px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "20px" }} onClick={(e) => e.stopPropagation()}>
          <label>
            Straighten:
            <input
              type="range"
              min="-45"
              max="45"
              step="1"
              value={rotation}
              onChange={handleRotationChange}
              style={{ margin: "0 10px" }}
            />
          </label>
        </div>
        <CustomButton
          text="Save Photo"
          onClick={saveCroppedImage}
          style={{ marginTop: "20px", padding: "10px 20px" }}
        />
      </div>
    </div>
  );
};

export default ImageEditor;
