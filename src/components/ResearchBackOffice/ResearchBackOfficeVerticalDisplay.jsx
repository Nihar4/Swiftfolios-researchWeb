import React from "react";
import useMarketStock from "../../hooks/useMarketStock";

const ResearchBackOfficeVerticalDisplay = ({stockCode}) => {
    const stockData = useMarketStock(stockCode)
    console.log("std",stockCode);
    
    
  return (
    <div>
      <div className="swift-folios-research-row3-container" >
        <div className="swift-folios-research-back-office-fund-name">{stockCode}</div>
        <div className="swift-folios-research-back-office-fund-price">Rs.{stockData?.last_traded_price}</div>
        <div className="swift-folios-research-back-office-fund-change-container">
          <div className="swift-folios-research-back-office-value-change">
            {stockData?.change_price}
          </div>
          <div className="swift-folios-research-back-office-per-change">
            {stockData?.change_percentage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchBackOfficeVerticalDisplay;
