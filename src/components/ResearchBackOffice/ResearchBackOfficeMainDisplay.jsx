import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import downloadIcon from "../../assets/icons/download_icon.svg";
import ServerRequest from "../../utils/ServerRequest";
import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import playButton from "../../assets/play-button.png";
import downArrow from "../../assets/icons/down_arrow.svg";
import "../../css/ResearchBackOffice/ResearchBackOffice.css";
import ResearchBackOfficeMainDisplayEditForm from "./ResearchBackOfficeMainDisplayEditForm";

const ResearchBackOfficeMainDisplay = ({ postDetails }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const sortedDetails = [...postDetails].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  useEffect(() => {
    if (isEditModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isEditModalOpen]);
  let reorderedDetails = [];
  if (sortedDetails.length === 1) {
    reorderedDetails = sortedDetails;
  } else if (sortedDetails.length > 1) {
    const oldest = sortedDetails[0];
    const newest = sortedDetails[sortedDetails.length - 1];
    const remaining = sortedDetails.slice(1, -1).reverse();
    reorderedDetails = [newest, oldest, ...remaining];
  }

  console.log("red", reorderedDetails);

  const handleToggleExpand = (itemId) => {
    setExpandedItems(
      (prev) =>
        new Set(
          prev.has(itemId)
            ? [...prev].filter((id) => id !== itemId)
            : [...prev, itemId]
        )
    );
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };
  const handleModalClose = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setIsEditModalOpen(false);
  };

  const handleFileDownload = async (fileUrl) => {
    try {
      const cleanUrl = fileUrl.split('_')[0];
      const response = await fetch(cleanUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  console.log("details",postDetails.thumbnail_url?.split('_')[0]);
  
  return (
    <div>
      <div className="swift-folios-back-office-posts-container">
        {reorderedDetails.map((detail) => (
          <div className="swift-folios-research-back-office-post-content">
            <div className="swift-folios-research-back-office-row2-date">
              <span>
                Posted On{" "}
                {new Date(detail.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(detail);
                }}
                className="swift-folios-research-back-office-button"
              >
                Edit
              </button>
            </div>
            <div
              key={detail.id}
              className={`swift-folios-back-office-research-row2 ${
                detail.video_url && detail.video_url !== "null" ? "with-video" : ""
              }`}
            >
              <div className="swift-folios-back-office-row2-sub-container">
                <div className="swift-folios-research-back-office-row2-header">
                  {detail.heading}
                </div>
                <div
                  className="swift-folios-research-back-office-row2-text"
                  dangerouslySetInnerHTML={{
                    __html: expandedItems.has(detail.id)
                      ? detail.description
                      : `${detail.description.slice(0, 150)}${
                          detail.description.length > 150 ? "..." : ""
                        }`,
                  }}
                ></div>

                {detail.file_url && (
                  <div className="swift-folios-research-file-container">
                    <div className="swift-folios-research-file">
                      <img src={downloadIcon} alt="file preview" onClick={() => handleFileDownload(detail.file_url)}/>
                    </div>
                    <button
                      onClick={() => handleFileDownload(detail.file_url)}
                      className="swift-folios-research-file-download-button"
                    >
                      Download
                    </button>
                  </div>
                )}

                {detail.description.length > 150 && (
                  <div className="back-office-read-more-content">
                    <button
                      className="swift-folios-back-office-read-more-button"
                      onClick={() => handleToggleExpand(detail.id)}
                    >
                      <img
                        src={downArrow}
                        alt=""
                        className={`down-arrow-icon ${
                          expandedItems.has(detail.id) ? "rotate" : ""
                        }`}
                      />
                    </button>
                    <span>
                      {expandedItems.has(detail.id) ? "Read Less" : "Read Full"}
                    </span>
                  </div>
                )}
              </div>

              {detail.video_url  && detail.video_url !== "null" &&  (
                <div className="swift-folios-research-back-office-video-preview-container">
                  <ReactPlayer
                    url={detail.video_url.split('_')[0]}
                    light={
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${detail.thumbnail_url?.split('_')[0]})`,
                          backgroundSize: "cover",
                          filter: "blur(4px)",
                        }}
                      />
                    }
                    playIcon={
                      <img
                        src={playButton}
                        alt="Play"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          cursor: "pointer",
                        }}
                      />
                    }
                    controls
                    playing={false}
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <SwiftFoliosModal
          closeModal={handleModalClose}
          className="swift-folios-back-office-edit-post-modal"
        >
          <div className="modal">
            <ResearchBackOfficeMainDisplayEditForm
              postData={selectedPost}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default ResearchBackOfficeMainDisplay;
