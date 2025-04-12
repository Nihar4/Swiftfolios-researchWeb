import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomBodyComponent = ({
  label,
  value,
  onChange,
  error,
  containerClassName,
  labelClassName,
  editorClassName,
  errorClassName,
}) => {
    console.log("lcln",labelClassName);
    
  return (
    <>
    <div className={containerClassName}>
      <label htmlFor="body" className={labelClassName}>
        {label}
      </label>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link"],
            [{ size: ["small", false, "large", "huge"] }],
          ],
        }}
        formats={[
          "header",
          "font",
          "list",
          "bold",
          "italic",
          "underline",
          "link",
          "size",
        ]}
        style={{
          height: "150px",
          width: "60vw",
          marginBottom: "20px",
        }}
        className={editorClassName}
      />
      
    </div>
    {error && <p className={errorClassName}>{error}</p>}
    </>
  );
};

export default CustomBodyComponent;
