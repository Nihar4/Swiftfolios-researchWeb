import React from "react";
import "../CustomError/CustomError.css";

const CustomError = ({ errorText, style = {}, classname = "" }) => {
  console.log(errorText);

  const visibilityStyle = {
    visibility:
      errorText === "" || errorText === "error" ? "hidden" : "visible",
  };

  return (
    <p
      className={"swift-custom-error " + classname}
      style={{ ...style, ...visibilityStyle }}
    >
      {errorText}
    </p>
  );
};

export default CustomError;
