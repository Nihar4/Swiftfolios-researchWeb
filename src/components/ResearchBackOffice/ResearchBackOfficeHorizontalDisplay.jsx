import React from 'react';
import useMarketStock from '../../hooks/useMarketStock';

const ResearchBackOfficeHorizontalDisplay = ({stockCode}) => {
    console.log("sc",stockCode);
    
    const stockData = useMarketStock("HDFCAMC")
    console.log("stockData",stockData);
    

    return (
        <div>
            <div className="swift-folios-research-row1">
              <div className="swift-folios-research-fund-name">{stockCode}</div>
              <div className="swift-folios-research-fund-price">
                Rs. {stockData?.last_traded_price}
              </div>
              <div className="swift-folios-research-value-change">
                {stockData?.change_price}
              </div>
              <div className="swift-folios-research-per-change">
                {stockData?.change_percentage}
              </div>
              <div className="back-office-update-button"></div>
            </div>
        </div>
    );
};

export default ResearchBackOfficeHorizontalDisplay;