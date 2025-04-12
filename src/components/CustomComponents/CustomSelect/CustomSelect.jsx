import React from "react";
import "./CustomSelect.css";
import ArrowUp from "../../../assets/icons/ArrowUp.svg";
import ArrowDown from "../../../assets/icons/ArrowDown.svg";

class CustomSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isListOpen: false,
    };
    this.toggleSelect = this.toggleSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isListOpen } = this.state;
    setTimeout(() => {
      if (isListOpen) {
        window.addEventListener("click", this.closeSelect);
      } else {
        window.removeEventListener("click", this.closeSelect);
      }
    }, 0);
  }

  toggleSelect() {
    this.setState((prevState) => ({
      isListOpen: !prevState.isListOpen,
    }));
  }

  selectOption(indx, value) {
    // Call parent's onTypeChange to update the controlled value.
    this.props.onTypeChange(value);
    this.setState({
      isListOpen: false,
    });
  }

  closeSelect() {
    this.setState({
      isListOpen: false,
    });
  }

  render() {
    const { width, height, options, error, formateName, heading, placeholder, value } = this.props;
    const { isListOpen } = this.state;
    const displayValue = value || placeholder;
    return (
      <div className="custom-select">
        <p className="select-title">{heading || "Select"}</p>
        <div
          className="custom-select-header"
          onClick={this.toggleSelect}
        >
          <span className="custom-select-title">
            {displayValue && formateName ? formateName(displayValue) : displayValue}
          </span>
          <span>
            {isListOpen ? (
              <img width={20} height={20} src={ArrowUp} alt="" />
            ) : (
              <img width={20} height={20} src={ArrowDown} alt="" />
            )}
          </span>
          {isListOpen && (
            <div className="custom-select-container overflow">
              {options.map((option, indx) => (
                <span
                  key={indx}
                  className={
                    (value === option)
                      ? "custom-select-option option-selected"
                      : "custom-select-option"
                  }
                  onClick={() => this.selectOption(indx, option)}
                >
                  {formateName ? formateName(option) : option}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className={error === "" ? "error-text hide swift-back-office-error" : "error-text swift-back-office-error"}>
          {error}
        </p>
      </div>
    );
  }
}

export default CustomSelect;
