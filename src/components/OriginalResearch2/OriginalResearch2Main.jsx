import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import downloadIcon from "../../assets/icons/download_icon.svg";
import ServerRequest from "../../utils/ServerRequest";
import playButton from "../../assets/play-button.png";
import downArrow from "../../assets/icons/down_arrow.svg";

import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";

const accountCode = "BRC4897812";

const OriginalResearch2Main = ({ postDetails }) => {
  const [visitedItems, setVisitedItems] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleToggleExpand = (itemId) => {
    setExpandedItems((prevExpanded) => {
      const updated = new Set(prevExpanded);
      if (updated.has(itemId)) {
        updated.delete(itemId);
      } else {
        updated.add(itemId);
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchVisitedData = async () => {
      try {
        const visitedData = await ServerRequest({
          method: "get",
          URL: "/swift-folios-research/visit-status/get",
        });

        const visitedIds = visitedData?.data
          .filter(
            (item) =>
              item.account_id === accountCode && item.visit_status === "1"
          )
          .map((item) => item.id);

        setVisitedItems(new Set(visitedIds));
      } catch (error) {
        console.error("Error fetching visit status:", error);
      }
    };

    fetchVisitedData();
  }, []);

  const handleVisitStatus = async (itemId) => {
    const data = {
      account_code: accountCode,
      item_id: itemId,
      visit_status: true,
    };

    try {
      await ServerRequest({
        method: "post",
        URL: "/swift-folios-research/visit-status/post",
        data: data,
      });
      setVisitedItems((prevVisited) => {
        const updated = new Set(prevVisited);
        updated.add(itemId);
        return updated;
      });
      console.log("Visit status updated successfully");
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };

  const handleFileDownload = async (fileUrl) => {
    try {
      const cleanUrl = fileUrl?.split('_')[0];
      const response = await fetch(cleanUrl);
      if (!response.ok) throw new Error("File not found or inaccessible");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      const downloadName = fileUrl?.split('_').pop() || "file";
      link.href = url;
      link.download = downloadName
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const sortedDetails = [...postDetails].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  let reorderedDetails = [];
if (sortedDetails.length === 1) {
  reorderedDetails = sortedDetails; 
} else if (sortedDetails.length > 1) {
  const oldest = sortedDetails[0];
  const newest = sortedDetails[sortedDetails.length - 1];
  const remaining = sortedDetails.slice(1, -1).reverse();
  reorderedDetails = [newest, oldest, ...remaining];
}

  return (
    <div>
      {reorderedDetails.length > 0 && (
        <div className="swift-folios-research-updated-post-container">
          {reorderedDetails.map((detail) => (
            <div
              key={detail.id}
              className={`swift-folios-research-row2 ${
                detail.video_url && detail.video_url !== "null" ? "with-video" : ""
              }`}
              onClick={() => handleVisitStatus(detail.id)}
              style={{
                backgroundColor: visitedItems.has(detail.id)
                  ? "transparent"
                  : "#FAFAFA",
              }}
            >
              <div className="swift-folios-research-updated-post-sub-container">
                <div className="swift-folios-research-row2-date">
                  Posted On{" "}
                  {new Date(detail.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className={`swift-folios-research-row2-header ${
      visitedItems.has(detail.id) ? "visited" : "visit"
    }`}>
                  {detail.heading}
                </div>
                <div
                  className={`swift-folios-research-row2-text ${
                    visitedItems.has(detail.id) ? "" : "visit"
                  }`}
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
              {detail.video_url  && detail.video_url !== "null" && (
                <div
                  key={detail.id}
                  style={{
                    position: "relative",
                    width: "365px",
                    height: "204px",
                  }}
                >
                  <ReactPlayer
                    key={detail.id}
                    url={detail.video_url}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default OriginalResearch2Main;
