import React from 'react';
import UserPanel from './UserPanel';
import Favoried from './Favorited';
import ChatRoom from './ChatRoom';
import DirectMessages from './DirectMessages';

function SidePanel() {
    return (
        <div className="side-panel__body">
            <UserPanel />
            <Favoried />
            <ChatRoom />
            <DirectMessages />
        </div>
    )
}

export default SidePanel
