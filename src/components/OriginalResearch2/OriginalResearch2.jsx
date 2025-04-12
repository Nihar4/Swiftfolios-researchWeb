import React, { useEffect, useState } from "react";
import CustomSearch from "../CustomComponents/CustomSearch/CustomSearch";

import OriginalResearch2HorizontalDisplay from "./OriginalResearch2HorizontalDisplay";
import OriginalResearch2Main from "./OriginalResearch2Main";
import OriginalResearch2VerticalDisplay from "./OriginalResearch2VerticalDisplay";
import Pulse from "../CustomComponents/Loader/Pulse";
import ServerRequest from "../../utils/ServerRequest";

import "../../css/SwiftFoliosReserch/SwiftFoliosResearch.css";

const OriginalResearch2 = ({ fundData }) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ServerRequest({
          method: "get",
          URL: "/swift-folios-research/form-data/get",
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
  }, []);

  return loading ? (
    <div className="swift-folios-research-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : allData?.length === 0 ? (
    <div className="no-data-container">
      <p>No Data Available</p>
    </div>
  ) : (
    <div className="swift-folios-research-main">
      <div className="swift-folios-research-main-header-container">
        <p className="swift-folios-research-main-header">
          Original Research- <i>Swift</i>Research
        </p>
        <CustomSearch />
      </div>
      {allData?.map((data, index) => (
        <div
          key={index}
          className={
            !data.video_url
              ? "swift-folios-research-container"
              : "swift-folios-research-container-with-video"
          }
        >
          <div className="swift-folios-research-sub-container">
            <OriginalResearch2HorizontalDisplay stockCode={data.stock_code} />
            <OriginalResearch2Main key={data.id} postDetails={data.post_details} />

            <div className="swift-folios-research-row3">
              {data?.related_stock?.map((stock, idx) => (
                <OriginalResearch2VerticalDisplay key={idx} stockCode={stock} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OriginalResearch2;
