import React from "react";
import { createPortal } from "react-dom";
import "./SwiftFoliosModal.css";

function SwiftFoliosModal({
  children,
  opacity = 0.5,
  top = "10%",
  closeModal = () => {},
  className = ""
}) {
  return createPortal(
    <div
      className={`swift-modal ${className}`}
      style={{
        background: `rgba(140, 140, 140, ${opacity})`,
        paddingTop: top,
      }}
      onClick={(e) => {
       
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="swift-modal-box">
        {children}
      </div>
    </div>,
    document.body
  );
}

export default SwiftFoliosModal;
