import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import ImageEditor from "../CustomComponents/ImageEditorComponent/ImageEditor";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomBodyComponent from "../CustomComponents/CustomBodyComponent/CustomBodyComponent";
import CustomSearchableDropdown from "../CustomComponents/CustomSearchableDropdown/CustomSearchableDropdown";
import CustomSelect from "../CustomComponents/CustomSelect/CustomSelect";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";

import image from "../../assets/edited-image.png";

import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../CustomComponents/Loader/Pulse";

import "./SwiftFoliosForm.css";
import StockSearch from "../CustomComponents/StockSearch/StockSearch";

const SwiftFoliosResearchForm = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [relatedStockSelections, setRelatedStockSelections] = useState([]);
  const [singleStockSelections, setSingleStockSelections] = useState([]);
  const [attachments, setAttachments] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const showError = (msg) => {
    return Alert({
      TitleText: "Warning",
      Message: msg,
      BandColor: "#e51a4b",
      AutoClose: {
        Active: true,
        Line: true,
        LineColor: "#e51a4b",
        Time: 3,
      },
    });
  };
  const showSuccess = (msg) => {
    return Alert({
      TitleText: "Success",
      Message: msg,
      BandColor: "#e51a4b",
      AutoClose: {
        Active: true,
        Line: true,
        LineColor: "#e51a4b",
        Time: 3,
      },
    });
  };

  const uniqueId = `${Date.now()}`;
  function generateUniqueId() {
    const timestamp = `${Date.now()}`;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomPart = "";
    for (let i = 0; i < 5; i++) {
      randomPart += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    const combined = (timestamp + randomPart)
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    return combined;
  }

  const postId = generateUniqueId();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (videoURL) {
      showError(
        "You can only upload a video file or enter a video URL, not both."
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showError("Video size exceeds 10MB");
      return;
    }
    setVideoFile(file);
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showError("Attachment size exceeds 10MB");
      return;
    }
    setAttachments(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!type) newErrors.type = "Type is required.";
    if (!heading.trim()) newErrors.heading = "Heading is required.";
    if (!body.trim()) newErrors.body = "Body content is required.";
    if (!singleStockSelections.length)
      newErrors.singleStock = "Please select at least one stock.";
    if (type === "video" && !videoFile && !videoURL)
      newErrors.video = "Video file or URL is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleURLChange = (e) => {
    const url = e.target.value;
    if (videoFile) {
      showError(
        "You can only upload a video file or enter a video URL, not both."
      );
      return;
    }
    setVideoURL(url);
  };

  const handleRelatedStockSelection = (selectedStock) => {
    if (singleStockSelections.includes(selectedStock)) {
      showError("This stock is already selected in single stock.");
      return;
    }
    if (relatedStockSelections.length >= 3) {
      showError("You can select a maximum of 3 stocks.");
      return;
    }
    if (!relatedStockSelections.includes(selectedStock)) {
      setRelatedStockSelections([...relatedStockSelections, selectedStock]);
    }
  };

  const handleSingleStockSelection = (selectedStock) => {
    if (relatedStockSelections.includes(selectedStock)) {
      showError("This stock is already selected in related stocks.");
      return;
    }
    if (singleStockSelections.length >= 1) {
      showError("You can select only one stock.");
      return;
    }
    setSingleStockSelections([selectedStock]);
  };

  const handleRemoveStock = (stock) => {
    setRelatedStockSelections(
      relatedStockSelections.filter((s) => s !== stock)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attachments) {
      showError("Please provide File");
      return;
    }
    if (type === "video" && videoFile && videoURL) {
      showError("Please provide either a video file or a video URL, not both.");
      return;
    }
    if (type === "video" && !videoFile && !videoURL) {
      showError("Please provide a video file or a video URL.");
      return;
    }
    if (!type) {
      showError("Please select a type.");
      return;
    }
    if (!heading.trim()) {
      showError("Please enter a heading.");
      return;
    }
    if (!body.trim()) {
      showError("Please enter content for the body.");
      return;
    }
    if (type === "video" && !videoFile && !videoURL) {
      showError("Please provide either a video file or a video URL.");
      return;
    }
    if (type === "post" && !attachments) {
      showError("Please upload a PDF.");
      return;
    }
    if (singleStockSelections.length === 0) {
      showError("Please select a single stock.");
      return;
    }
    if (type === "video" && !thumbnailFile) {
      showError("Please attach a Thumbnail");
      return;
    }
    if (relatedStockSelections.length === 0) {
      showError("Please select at least one related stock.");
      return;
    }
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("id", uniqueId);
    formData.append("body", body);
    formData.append("date", JSON.stringify(currentDate));
    formData.append("heading", heading);
    formData.append("stockData", singleStockSelections);
    formData.append("relatedStockData", JSON.stringify(relatedStockSelections));
    formData.append("videoUrl", videoURL);
    if (attachments) {
      formData.append("file", attachments);
    }
    if (videoFile) {
      formData.append("videoFile", videoFile);
    }
    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }
    try {
      setLoading(true);
      const request = await ServerRequest({
        method: "post",
        URL: "/swift-folios-research/form-data/post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (request?.message === "Data added successfully") {
        showSuccess("Form submitted successfully");
        navigate("/research2");
      }
    } catch (error) {
      showError("Error submitting the form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swift-folios-research-form-container">
      {loading ? (
        <div className="swift-folios-research-loader">
          <p>Loading</p>
          <Pulse />
        </div>
      ) : (
        <form>
          <div className="swift-folios-research-form-group type-select">
            <CustomSelect
              heading="Type"
              options={["Select Type", "Post", "Video"]}
              defaultIndex={0}
              value={type.charAt(0).toUpperCase() + type.slice(1)}
              onTypeChange={(value) => setType(value.toLowerCase())}
              placeholder="Select Type"
              error={errors.type}
            />
          </div>
          <div className="form-scrollable-content">
            {(type === "post" || type === "video") && (
              <>
                <div className="swift-folios-research-form-stock-container">
                  <label htmlFor="" className="stock-label">
                    Select Stock
                  </label>
                  <StockSearch
                    handleSelect={(s) => {
                      handleSingleStockSelection(s);
                    }}
                  />
                  <div className="selected-stocks">
                    {singleStockSelections.length > 0 && (
                      <div className="selected-stocks">
                        {singleStockSelections.map((stock, index) => (
                          <div key={index} className="selected-stock-item">
                            <span>{stock}</span>
                            <button
                              className="remove-stock-button"
                              onClick={() => handleRemoveStock(stock)}
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.singleStock && (
                    <p className="error-text">{errors.singleStock}</p>
                  )}
                </div>
                <div className="swift-folios-research-form-group">
                  <CustomInputError
                    labelText="Heading"
                    type="text"
                    name="heading"
                    value={heading}
                    classnameLabel="swift-folios-research-form-text"
                    classnameInput="swift-folios-research-form-text-input"
                    onInputChange={(name, value) => setHeading(value)}
                    error={errors.heading}
                  />
                </div>
                <CustomBodyComponent
                  label="Body"
                  value={body}
                  onChange={setBody}
                  error={errors.body}
                  containerClassName="swift-folios-research-form-group react-quill-group"
                  labelClassName="swift-folios-research-form-text"
                  editorClassName="react-quill"
                  errorClassName="error-text error-body"
                />
                <div className="swift-folios-research-form-stock-container">
                  <label htmlFor="" className="stock-label">
                    Select Related Stock
                  </label>
                  <StockSearch
                    handleSelect={(s) => {
                      handleRelatedStockSelection(s);
                    }}
                  />
                  <div className="selected-stocks">
                    {relatedStockSelections.length > 0 && (
                      <div className="selected-stocks">
                        {relatedStockSelections.map((stock, index) => (
                          <div key={index} className="selected-stock-item">
                            <span>{stock}</span>
                            <button
                              className="remove-stock-button"
                              onClick={() => handleRemoveStock(stock)}
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="swift-folios-research-form-group">
                  <div className="swift-folios-research-file-group">
                    <label
                      htmlFor="attachments"
                      className="swift-folios-research-form-text"
                    >
                      Upload Pdf
                    </label>
                    <input
                      type="file"
                      id="attachments"
                      accept=".pdf"
                      onChange={handleAttachmentChange}
                      style={{ display: "none", cursor: "pointer" }}
                    />
                    {attachments && (
                      <div className="swift-folios-research-file-display">
                        <p className="uploaded-file-name">{attachments.name}</p>
                        <button
                          className="remove-file-button"
                          onClick={() => setAttachments(null)}
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {type === "video" && (
                  <>
                    <div className="swift-folios-research-form-group">
                      <div className="swift-folios-research-file-group">
                        <label
                          htmlFor="videoFile"
                          className="swift-folios-research-form-text"
                        >
                          Upload Video
                        </label>
                        <input
                          type="file"
                          id="videoFile"
                          accept="video/*"
                          onChange={handleFileChange}
                          style={{ display: "none", cursor: "pointer" }}
                        />

                        {videoFile && (
                          <div className="swift-folios-research-file-display">
                            <p className="uploaded-file-name">
                              {videoFile.name}
                            </p>
                            <button
                              className="remove-file-button"
                              onClick={() => setVideoFile(null)}
                            >
                              ✖
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ paddingBottom: "5px" }}>OR</div>
                    <div className="swift-folios-research-form-group">
                      <CustomInputError
                        labelText="Video URL"
                        type="text"
                        name="videoURL"
                        value={videoURL}
                        classnameLabel="swift-folios-research-video-label"
                        onInputChange={(name, value) => setVideoURL(value)}
                        error={errors.video}
                      />
                    </div>
                    <div className="swift-folios-research-form-group swift-folios-research-form-thumbnail-content">
                      <button
                        type="button"
                        onClick={() => setIsImageEditorOpen(true)}
                        className="swift-folios-research-form-image-edit-button"
                      >
                        Upload Thumbnail
                      </button>
                      {thumbnailFile && (
                        <div className="swift-folios-research-file-display">
                          <p className="uploaded-file-name">
                            {thumbnailFile.name}
                          </p>
                          <button
                            className="remove-file-button"
                            onClick={() => setThumbnailFile(null)}
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className="swift-folios-research-form-group">
                  <CustomButton
                    text="Submit"
                    classname="swift-folios-research-form-submit-button"
                    onClick={handleSubmit}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      )}
      {isImageEditorOpen && (
        <SwiftFoliosModal closeModal={() => setIsImageEditorOpen(false)}>
          <div className="swift-folios-research-form-image-editor-modal">
            <ImageEditor
              onSave={(fileName) => {
                setThumbnailFile(fileName);
                setIsImageEditorOpen(false);
              }}
            />
          </div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default SwiftFoliosResearchForm;
