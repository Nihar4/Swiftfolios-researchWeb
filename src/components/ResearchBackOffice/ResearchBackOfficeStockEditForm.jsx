import React, { useState } from "react";
import StockSearch from "../CustomComponents/StockSearch/StockSearch";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import Pulse from "../CustomComponents/Loader/Pulse";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import ServerRequest from "../../utils/ServerRequest";
import "./ResearchBackOfficeStockEditForm.css";

const ResearchBackOfficeStockEditForm = ({ postData, onClose }) => {
  console.log("postId====", postData);

  const [singleStockSelections, setSingleStockSelections] = useState(
    postData?.stock_code ? [postData.stock_code] : []
  );
  const [relatedStockSelections, setRelatedStockSelections] = useState(
    postData?.related_stock || []
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const postId = postData.id;

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

  const handleSingleStockSelection = (selectedStock) => {
    if (relatedStockSelections.length >= 1) {
      showError("You can select only one stock.");
      return;
    }
    if (!singleStockSelections.includes(selectedStock)) {
      setSingleStockSelections([selectedStock]);
    }
  };

  const handleRelatedStockSelection = (selectedStock) => {
    if (singleStockSelections.includes(selectedStock)) {
      showError("This stock is already selected as the main stock.");
      return;
    }

    if (relatedStockSelections.includes(selectedStock)) {
      showError("This stock is already selected as a related stock.");
      return;
    }

    if (relatedStockSelections.length >= 3) {
      showError("You can select a maximum of 3 related stocks.");
      return;
    }

    setRelatedStockSelections([...relatedStockSelections, selectedStock]);
  };

  const handleRemoveStock = (stock) => {
    setRelatedStockSelections(
      relatedStockSelections.filter((s) => s !== stock)
    );
    setSingleStockSelections(singleStockSelections.filter((s) => s !== stock));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (singleStockSelections.length === 0) {
      showError("Please select a single stock.");
      return;
    }
    if (relatedStockSelections.length === 0) {
      showError("Please select at least one related stock.");
      return;
    }

    const formData = new FormData();
    formData.append("stockData", singleStockSelections);
    formData.append("relatedStockData", JSON.stringify(relatedStockSelections));

    try {
      setLoading(true);
      const response = await ServerRequest({
        method: "put",
        URL: `/back-office/post/stock/${postId}/edit`,
        data: formData,
      });
      if (response && response.message === "Stock updated successfully") {
        showSuccess("Stock updated successfully");
        onClose();
      } else {
        showError("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      showError("Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swift-folios-research-back-office-stock-edit-form-container">
      {loading ? (
        <div className="swift-folios-research-back-office-loader">
          <p>Loading</p>
          <Pulse />
        </div>
      ) : (
        <div>
          <div className="back-office-stock-edit-header">
            <h4></h4>
            <button className="close-modal" onClick={onClose}>
              ✖
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{display: "flex",flexDirection: "column",gap: "15px"}}
    
>
            <div className="back-office-stock-container">
              <label className="stock-label">Select Stock</label>
              <div className="stock-container">
                <StockSearch handleSelect={handleSingleStockSelection} />
              </div>
              <div className="selected-stocks">
                {singleStockSelections.length > 0 &&
                  singleStockSelections.map((stock, index) => (
                    <div key={index} className="selected-stock-item">
                      <span>{stock}</span>
                      <button
                        type="button"
                        className="remove-stock-button"
                        onClick={() => handleRemoveStock(stock)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
              </div>
              {errors.singleStock && (
                <p className="error-text">{errors.singleStock}</p>
              )}
            </div>
            <div className="back-office-stock-container">
              <label className="stock-label">Select Related Stock</label>
              <div className="stock-container">
                <StockSearch handleSelect={handleRelatedStockSelection} />
              </div>
              <div className="selected-stocks">
                {relatedStockSelections.length > 0 &&
                  relatedStockSelections.map((stock, index) => (
                    <div key={index} className="selected-stock-item">
                      <span>{stock}</span>
                      <button
                        type="button"
                        className="remove-stock-button"
                        onClick={() => handleRemoveStock(stock)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <CustomButton
              type="submit"
              text="Save Changes"
              classname="swift-folios-research-back-office-form-submit-button stock-edit-submit-button"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default ResearchBackOfficeStockEditForm;
