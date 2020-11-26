import React, { Component } from 'react'
import Message from './Message';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';

export class MainPanel extends Component {
    render() {
        return (
            <div className="main-panel__body">
                <MessageHeader />
                <div className="main-panel__hader-box"></div>
                <MessageForm />
            </div>
        )
    }
}

export default MainPanel
