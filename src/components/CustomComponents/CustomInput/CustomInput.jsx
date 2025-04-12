import React, { useEffect, useState } from "react";
import CustomLabel from "../CustomLabel/CustomLabel";
import CustomInputBox from "../CustomInputBox/CustomInputBox";
import "../CustomInput/CustomInput.css";

const CustomInput = ({
  labelText,
  type,
  name,
  placeholder,
  value,
  maxLength = 100,
  onInputChange,
  onClick,
  classnameDiv,
  classnameLabel,
  classnameInput,
  styleDiv = {},
  styleInput = {},
  styleLabel = {},
  onKeyUp,
}) => {
  const [value1, setValue1] = useState(value);
  useEffect(() => {
    setValue1(value);
  }, [value]);

  // setValue1(value);
  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type === "number" && maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    if (type === "number") {
      inputValue = parseFloat(inputValue);
    }
    console.log(inputValue);
    onInputChange && onInputChange(name, inputValue);
  };

  return (
    <div className={classnameDiv} style={styleDiv}>
      <CustomLabel
        className={classnameLabel}
        labelText={labelText}
        style={{ styleLabel }}
      />
      <CustomInputBox
        type={type}
        value={value1}
        name={name}
        classname={classnameInput}
        placeholder={placeholder}
        onChange={handleChange}
        onClick={onClick}
        maxLength={maxLength}
        style={styleInput}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export default CustomInput;
