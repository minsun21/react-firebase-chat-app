import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mime from 'mime-types';

import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import firebase from '../../../firebase';
import { setPhotoURL } from '../../../redux/actions/user_action';

function UserPanel() {
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const inputOpenImageRef = useRef();

    const handleLogout = () => {
        firebase.auth().signOut();
    }
    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        const metadata = { contentType: mime.lookup(file.name) };
        try {
            let uploadTaskSnapshot = await firebase.storage().ref().child(`user_image/${user.uid}`).put(file, metadata);
            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
            console.log(downloadURL)
            await firebase.auth().currentUser.updateProfile({
                photoURL: downloadURL
            })
            dispatch(setPhotoURL(downloadURL));
            await firebase.database().ref("users").child(user.uid).update({ image: downloadURL });
        } catch (error) {
            alert(error);
        }
    }
    const handleOpenImgRef = () => {
        inputOpenImageRef.current.click();
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
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOpenImgRef}>프로필 사진 변경</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <input ref={inputOpenImageRef} type="file" style={{ display: 'none' }} accept="image/jpeg, image/png" onChange={handleUploadImage} />
        </div>
    )
}

export default UserPanel
