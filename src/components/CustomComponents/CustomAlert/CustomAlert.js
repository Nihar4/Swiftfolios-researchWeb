
import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import PropTypes from "prop-types";
import '../CustomAlert/CustomAlert.css';
import Close from '../../../assets/crossicon.svg';

let containerDOMNode;

const Alert = (config, closeAlert) => {
    containerDOMNode = document.createElement('div');
    containerDOMNode.classList.add('custom__alert__box');
    document.body.appendChild(containerDOMNode);
    render(<AlertBox DOMRef={containerDOMNode} closeAlert={closeAlert} {...config} />, containerDOMNode);
}

class AlertBox extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const config = this.props;
        setTimeout(() => {
            $(this.props.DOMRef).addClass('active');
        }, 10);

        this.autoClose(this.props.DOMRef, config.AutoClose);
    }

    autoClose(DOMRef, AutoClose) {
        const { Active, Time } = AutoClose;

        if (Active) {
            setTimeout(() => {
                this.closePopup(DOMRef);
            }, Time * 1000);
        }
    }

    closePopup(DOMRef) {
        $(DOMRef).removeClass('active');
        setTimeout(() => {
            DOMRef && document.body.contains(DOMRef) && document.body.removeChild(DOMRef);
            if (this.props.closeAlert) {
                this.props.closeAlert();
            }
        }, 1000);
    }

    render() {
        const { TitleText, Message, Band, BandColor, BoxColor, TextColor, AutoClose } = this.props;
        const { Active, Line, LineColor, Time } = AutoClose;

        return (
            <>
                <div className="custom__alert__box__container" style={{ backgroundColor: `${BoxColor}`, color: `${TextColor}` }}>
                    <div className="custom__alert__content">
                        <div className="custom__alert__text">
                            <h6>{TitleText}</h6>
                            <p>{Message}</p>
                        </div>
                        <div className="custom__alert__close" onClick={() => { this.closePopup(this.props.DOMRef) }}>
                            <img src={Close} alt="X" />
                        </div>
                    </div>
                    {Active && Line &&
                        <div className="custom__alert__bottom__line" style={{
                            backgroundColor: `transparent`,
                            animation: `animateLine ${Time}s linear forwards`
                        }}>
                        </div>
                    }
                </div>
            </>
        )
    }
}

AlertBox.propTypes = {
    TitleText: PropTypes.string.isRequired,
    Message: PropTypes.string.isRequired,
    Band: PropTypes.bool,
    BandColor: PropTypes.string,
    BoxColor: PropTypes.string,
    TextColor: PropTypes.string,
    AutoClose: PropTypes.object,
    closeAlert: PropTypes.func.isRequired
}

AlertBox.defaultProps = {
    TitleText: 'Warning',
    Message: 'Something Wrong',
    Band: true,
    BandColor: "#3179F5",
    BoxColor: '#ffffff',
    TextColor: '#404040',
    AutoClose: {
        Active: false,
        Line: false,
    }
}

export { Alert };
