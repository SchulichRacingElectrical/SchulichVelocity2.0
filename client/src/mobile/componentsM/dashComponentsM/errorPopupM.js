import React from 'react';
import { Button } from 'react-bootstrap'
import '../../styling/errorPopupM.css'
export default class ErrorPopup extends React.Component {
    render() {
        return (
            <div class='error-popup'>
                <div class='error-popup-inner'>
                    <h4 class='text'>{this.props.text}</h4>
                    <Button class='close-btn' onClick={this.props.closePopup}>Close</Button>
                </div>
            </div>
        );
    }
}