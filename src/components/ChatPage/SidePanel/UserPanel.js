import React from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';

function UserPanel() {
    const user = useSelector(state => state.user.currentUser);
    const handleLogout = () => {
        firebase.auth().signOut();
    }
    return (
        <div className="side-panel__user-panel">
            <h3>
                <IoIosChatboxes /> {" "} Chat App
            </h3>
            <div className="user-panel__dropdown">
                <Image className="user-panel__dropdown-user-img" src={user && user.photoURL} roundedCircle />
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                        {user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">프로필 사진 변경</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
