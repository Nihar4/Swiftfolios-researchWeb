import React from "react";
import "../CustomButton/CustomButton.css";

const CustomButton = ({ style, text, classname, onClick,disabled ,type = "button" }) => {

  

  return (
    <button
    type={type}
      className={"swift-folios-custom-btn " + classname}
      style={style}
      onClick={onClick ? onClick : null}
    >
      {text}
    </button>
  );
};

export default CustomButton;
