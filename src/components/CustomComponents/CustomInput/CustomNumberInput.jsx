import React, { useEffect, useState } from "react";
import CustomLabel from "../CustomLabel/CustomLabel";
import CustomInputBox from "../CustomInputBox/CustomInputBox";
import "../CustomInput/CustomInput.css";

const numberFormatMatrix = (number, frac = 2, minfrac = 2, decimal) => {
  if (!number) {
    number = 0;
  }
  let isIncludeDot = false;
  if (typeof number === "string" && number.charAt(number.length - 1) === ".") {
    isIncludeDot = true;
    console.log(number, isIncludeDot);
  }
  if (typeof number === "string") {
    number = number.replace(/[^0-9.]/g, "");
    minfrac =
      number.charAt(number.length - 1) !== "." && number.includes(".")
        ? 1
        : minfrac;
  }
  if (isNaN(number) || !isFinite(number)) {
    number = 0;
  }

  console.log(number, isIncludeDot);
  return (
    parseFloat(number).toLocaleString("en-US", {
      minimumFractionDigits: minfrac,
      maximumFractionDigits: frac,
    }) + (isIncludeDot && decimal ? "." : "")
  );
};

const parseFormattedNumber = (formattedString) => {
  const numberString = formattedString.replace(/[^0-9.]/g, "");
  return numberString;
};

const CustomNumberInput = ({
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
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    setFormattedValue(
      numberFormatMatrix(value, 2, 0, type == "decimal" ? true : false)
    );
  }, [value]);

  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type === "number" && maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    const unformattedValue = parseFormattedNumber(inputValue);
    const formatted = numberFormatMatrix(
      unformattedValue,
      2,
      0,
      type == "decimal" ? true : false
    );
    console.log(inputValue, unformattedValue, formatted);

    onInputChange && onInputChange(name, unformattedValue);
    // setFormattedValue(formatted);
  };

  return (
    <div className={classnameDiv} style={styleDiv}>
      <CustomLabel
        className={classnameLabel}
        labelText={labelText}
        style={{ styleLabel }}
      />
      <CustomInputBox
        type="text"
        value={formattedValue}
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

export default CustomNumberInput;
