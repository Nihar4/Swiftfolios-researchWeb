import React from "react";
import "../CustomInputBox/CustomInputBox.css";

const CustomInputBox = ({
  type,
  value,
  placeholder,
  onChange,
  onClick,
  style,
  name,
  maxLength,
  classname,
  onKeyUp,
}) => {
  return (
    <input
      style={style}
      id={name}
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      onClick={onClick}
      placeholder={placeholder}
      maxLength={maxLength}
      className={"swift-custom-input-box " + classname}
      onKeyUp={onKeyUp}
      autoComplete="off"
    />
  );
};

export default CustomInputBox;
