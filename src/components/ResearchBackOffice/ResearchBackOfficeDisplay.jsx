import React, { useEffect, useState } from "react";

import ResearchBackOfficeHorizontalDisplay from "./ResearchBackOfficeHorizontalDisplay";
import ResearchBackOfficeMainDisplay from "./ResearchBackOfficeMainDisplay";
import ResearchBackOfficeVerticalDisplay from "./ResearchBackOfficeVerticalDisplay";
import ResearchBackOfficeUpdateForm from "./ResearchBackOfficeUpdateForm";
import ResearchBackOfficeStockEditForm from "./ResearchBackOfficeStockEditForm";

import SwiftFoliosModal from "../CustomComponents/SwiftFoliosModal/SwiftFoliosModal";
import Pulse from "../CustomComponents/Loader/Pulse";
import ServerRequest from "../../utils/ServerRequest";
import "../../css/ResearchBackOffice/ResearchBackOffice.css"
// import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";

const ResearchBackOfficeDisplay = ({ fundData }) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ServerRequest({
          method: "get",
          URL: "/back-office/post/get",
        });
        setTimeout(() => {
          setAllData(data.data);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [allData]);

  useEffect(() => {
      if (isUpdateModalOpen || isEditStockModalOpen) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    }, [isUpdateModalOpen,isEditStockModalOpen]);

  const handleUpdateClick = (post) => {
    setSelectedPost(post);
    setIsUpdateModalOpen(true);
  };

  const handleEditStockClick = (post) => {
    setSelectedPost(post);
    setIsEditStockModalOpen(true);
  };

  const handleCloseModal = (e) => {
    e?.stopPropagation(); 
    e?.preventDefault()
    setIsUpdateModalOpen(false);
    setIsEditStockModalOpen(false);
    setSelectedPost(null);
  };

  return loading ? (
    <div className="swift-folios-research-back-office-main-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : allData?.length === 0 ? (
    <div className="no-data-container">
      <p>No Data Available</p>
    </div>
  ) : (
    <div className="swift-folios-research-back-office-main">
      <div className="swift-folios-research-back-office-main-header-container">
        <p className="swift-folios-research-back-office-main-header">
          Original Research- <i>Swift</i>Research
        </p>
      </div>
      {allData?.map((data, index) => (
        <div
          key={index}
          className={
            !data.video_url
              ? "swift-folios-research-back-office-container"
              : "swift-folios-research-back-office-container-with-video"
          }
        >
          <div className="swift-folios-research-back-office-sub-container">
            <div className="swift-folios-research-back-office-row1">
              <ResearchBackOfficeHorizontalDisplay stockCode={data.stock_code} />
              <div className="swift-folios-back-office-buttons-container">
              <button onClick={() => handleUpdateClick(data)}  className="swift-folios-research-back-office-button">Update</button>
              <button onClick={() => handleEditStockClick(data) } className="swift-folios-research-back-office-button">Edit Stock</button>
              </div>
            </div>
            <ResearchBackOfficeMainDisplay key={data.id} postDetails={data.post_details} />
            <div className="swift-folios-research-back-office-row3-container">
              {data?.related_stock?.map((stock, idx) => (
                <ResearchBackOfficeVerticalDisplay key={idx} stockCode={stock} />
              ))}
            </div>
          </div>
        </div>
      ))}
      {isUpdateModalOpen && (
        <SwiftFoliosModal closeModal={handleCloseModal} className="swift-folios-back-office-update-post-modal">
          <div className="modal"><ResearchBackOfficeUpdateForm postData={selectedPost} onClose={handleCloseModal} /></div>
        </SwiftFoliosModal>
      )}
      {isEditStockModalOpen && (
        <SwiftFoliosModal closeModal={handleCloseModal}  className="swift-folios-back-office-edit-stock-modal">
          <div className="modal stock-edit-modal"><ResearchBackOfficeStockEditForm postData={selectedPost} onClose={handleCloseModal} /></div>
        </SwiftFoliosModal>
      )}
    </div>
  );
};

export default ResearchBackOfficeDisplay;
