import React from 'react';
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';

function ChatPage() {
    return (
        <div className="chat-page">
            <div className="chat-page__side-panel">
                <SidePanel />
            </div>
            <div className="chat-page__main-panel">
                <MainPanel />
            </div>
        </div>
    )
}

export default ChatPage
