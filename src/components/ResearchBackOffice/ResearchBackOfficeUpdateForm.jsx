import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import ImageEditor from "../CustomComponents/ImageEditorComponent/ImageEditor";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import CustomBodyComponent from "../CustomComponents/CustomBodyComponent/CustomBodyComponent";
import CustomSelect from "../CustomComponents/CustomSelect/CustomSelect";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";

import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../CustomComponents/Loader/Pulse";

import "./ResearchBackOfficeUpdateForm.css";

const ResearchBackOfficeUpdateForm = ({ postData, onClose }) => {
  console.log("postData",postData);
  
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const uniqueId = postData.id;

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
        BandColor: "#28a745",
        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#28a745",
          Time: 3,
        },
      });
    };

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
  const isValidUrl = (str) => {
    const pattern = new RegExp(
      "^([a-zA-Z]+:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return pattern.test(str);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "video" && videoFile && videoURL) {
      showError("Please provide either a video file or a video URL, not both.");
      return;
    }
    if (type === "video" && !videoFile && !videoURL) {
      showError("Please provide a video file or a video URL.");
      return;
    }
    if (type === "video" && videoURL && !isValidUrl(videoURL)) {
      showError("Please enter a valid video URL.");
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
    if (!attachments){
      showError("Please upload a Pdf");
      return;
    }
    if (!body.trim()) {
      showError("Please enter content for the body.");
      return;
    }
    
    if (type === "video" && !thumbnailFile) {
      showError("Please provide either a Thumbnail File");
      return;
    }

    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const formData = new FormData();
    formData.append("id", uniqueId);
    formData.append("body", body);
    formData.append("date", JSON.stringify(currentDate));
    formData.append("heading", heading);
    formData.append("videoUrl", videoURL);
    formData.append("postId", postId);

    if (attachments) formData.append("file", attachments);
    if (videoFile) formData.append("videoFile", videoFile);
    if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

    try {
      setLoading(true);
      const request = await ServerRequest({
        method: "post",
        URL: "/back-office/post/add",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (request?.message === "Data added successfully") {
        showSuccess("Form submitted successfully");
        onClose();
        navigate("/back-office/display");
      }
    } catch (error) {
      showError("Error submitting the form");
      console.error("upfe", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swift-folios-research-back-office-form-container">
      {loading ? (
        <div className="swift-folios-research-back-office-update-modal-loader">
          <p>Loading</p>
          <Pulse />
        </div>
      ) : (
        <form>
          <div className="back-office-update-form-header">
            <div className="swift-folios-research-back-office-form-group header-dropdown">
              <CustomSelect
                heading="Type"
                options={["Select Type","Post", "Video"]}
                defaultIndex={0}
                value={type.charAt(0).toUpperCase() + type.slice(1)}
                onTypeChange={(value) => setType(value.toLowerCase())}
                placeholder="Select Type"
                error={errors.type}
              />
            </div>
            <button
              className="form-close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose(e);
              }}
            >
              ✖
            </button>
          </div>

          {(type === "post" || type === "video") && (
            <>
              <div className="swift-folios-research-back-office-form-group">
                <CustomInputError
                  labelText="Heading"
                  type="text"
                  name="heading"
                  classnameLabel="swift-folios-research-back-office-form-text"
                  classnameInput="swift-folios-research-back-office-form-text-input"
                  value={heading}
                  onInputChange={(name, value) => setHeading(value)}
                  error={errors.heading}
                />
              </div>

              <CustomBodyComponent
                label="Body"
                value={body}
                onChange={setBody}
                error={errors.body}
                containerClassName="swift-folios-research-back-office-form-group react-quill-group"
                labelClassName="swift-folios-research-back-office-form-body-text"
                editorClassName="react-quill"
                errorClassName="error-text error-body"
              />

              <div className="swift-folios-research-back-office-form-group">
                <div className="swift-folios-research-back-office-file-group">
                  <label
                    htmlFor="attachments"
                    className="swift-folios-research-back-office-form-text"
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
                    <div className="swift-folios-research-back-office-file-display">
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
                  <div className="swift-folios-research-back-office-form-group">
                    <div className="swift-folios-research-back-office-file-group">
                      <label
                        htmlFor="videoFile"
                        className="swift-folios-research-back-office-form-text"
                        onClick={(e) => e.stopPropagation()}
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
                        <div className="swift-folios-research-back-office-file-display">
                          <p className="uploaded-file-name">{videoFile.name}</p>
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
                      <div className="swift-folios-research-back-office-video-option-separator">
                        OR
                      </div>
                  <div className="swift-folios-research-back-office-form-group">
                    <CustomInputError
                      labelText="Video URL"
                      type="text"
                      name="videoURL"
                      value={videoURL}
                      classnameLabel={
                        "swift-folios-research-back-office-form-text"
                      }
                      onInputChange={(name, value) => setVideoURL(value)}
                      error={errors.video}
                    />
                  </div>
                  <div className="swift-folios-research-back-office-form-group swift-folios-research-back-office-thumbnail-content">
                    <button
                      type="button"
                      onClick={() => setIsImageEditorOpen(true)}
                      className="swift-folios-research-back-office-form-image-edit-button"
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

              <div className="swift-folios-research-back-office-form-group">
                <CustomButton
                  text="Submit"
                  classname="swift-folios-research-back-office-form-submit-button"
                  onClick={handleSubmit}
                  type="submit"
                />
              </div>
            </>
          )}
        </form>
      )}

      {isImageEditorOpen && (
        <SwiftFoliosModal closeModal={() => setIsImageEditorOpen(false)}>
          <div className="swift-folios-research-back-office-form-image-editor-modal">
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

export default ResearchBackOfficeUpdateForm;
