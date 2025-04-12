import React from "react";
import useMarketStock from "../../hooks/useMarketStock";

const OriginalResearch2VerticalDisplay = ({stockCode}) => {
    const stockData = useMarketStock(stockCode)
    console.log("std",stockCode);
    
    
  return (
    <div>
      <div className="swift-folios-research-row3-container" >
        <div className="swift-folios-research-fund-name">{stockCode}</div>
        <div className="swift-folios-research-fund-price">Rs.{stockData?.last_traded_price}</div>
        <div className="swift-folios-research-fund-change-container">
          <div className="swift-folios-research-value-change">
            {stockData?.change_price}
          </div>
          <div className="swift-folios-research-per-change">
            {stockData?.change_percentage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OriginalResearch2VerticalDisplay;
