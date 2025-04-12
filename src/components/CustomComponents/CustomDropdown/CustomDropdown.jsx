import React, { useState, useEffect } from 'react';
import downloadIcon from "../../../assets/icons/down_arrow.svg";
import "../CustomDropdown/CustomDropdown.css";

const CustomDropdown = ({
    label,
    options,
    placeholder = 'Select an option',
    selected,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(selected || null);

    useEffect(() => {
        setSelectedOption(selected);
    }, [selected]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(option);
        }
    };

    const handleBlur = () => {
        // Close the dropdown when it loses focus
        setIsOpen(false);
    };

    return (
        <div className="container" tabIndex={0} onBlur={handleBlur}>
            {label && <label className="dropdown-label">{label}</label>}
            <div className="dropdown-header" onClick={toggleDropdown}>
                {selectedOption || placeholder}
                <img
                    src={downloadIcon}
                    alt="Dropdown Icon"
                    className={`dropdown-icon ${isOpen ? "open" : ""}`}
                />
            </div>
            {isOpen && (
                <ul className="dropdown-list">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;
