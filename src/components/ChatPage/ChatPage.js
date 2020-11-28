import React from 'react';
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';
import { useSelector } from 'react-redux';

function ChatPage() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    return (
        <div className="chat-page">
            <div className="chat-page__side-panel">
                <SidePanel />
            </div>
            <div className="chat-page__main-panel">
                <MainPanel key={chatRoom && chatRoom.id} />
            </div>
        </div>
    )
}

export default ChatPage
