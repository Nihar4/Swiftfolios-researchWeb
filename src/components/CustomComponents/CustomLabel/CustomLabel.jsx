import React from "react";
import "../CustomLabel/CustomLabel.css";

const CustomLabel = ({ labelText, style, classname }) => {
  // const defaultStyle = {
  //   color: "#011627",
  //   fontFamily: "Open Sans",
  //   fontSize: "12px",
  //   fontStyle: "normal",
  //   fontWeight: "700",
  //   lineHeight: "normal",
  //   letterSpacing: "-0.65px",
  //   display: "block",
  // };

  return (
    <label className={"swift-custom-label " + classname} style={style}>
      {labelText}
    </label>
  );
};

export default CustomLabel;
