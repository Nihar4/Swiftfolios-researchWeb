import React, { useState, useEffect, useRef } from "react";
import downloadIcon from "../../../assets/icons/down_arrow.svg";
import "./CustomSearchableDropdown.css";

const CustomSearchableDropdown = ({
  label,
  options,
  placeholder = "Search or select an option",
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selected || "");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="searchable-container" ref={dropdownRef}>
      {label && <label className="searchable-dropdown-label">{label}</label>}
      <div className="searchable-dropdown-header">
        <input
          type="text"
          className="searchable-dropdown-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setIsOpen(true)} // Always open when input is clicked
        />
        <img
          src={downloadIcon}
          alt="Dropdown Icon"
          className={`searchable-dropdown-icon ${isOpen ? "open" : ""}`}
          onClick={toggleDropdown} // Arrow toggles dropdown open/close
        />
      </div>
      {isOpen && (
        <ul className="searchable-dropdown-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="searchable-dropdown-item"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="searchable-dropdown-item">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSearchableDropdown;
