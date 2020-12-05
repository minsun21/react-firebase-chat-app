import React, { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

function MessageForm() {
    const [content, setcontent] = useState();
    const [errors, seterrors] = useState([]);
    const [loading, setloading] = useState(false);
    const [percentage, setpercentage] = useState(0);

    const inputOpenImageRef = useRef();
    const messagesRef = firebase.database().ref("messages");
    const storageRef = firebase.storage().ref();
    const typingRef = firebase.database().ref("typing");

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    const user = useSelector(state => state.user.currentUser);
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }
        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content;
        }
        return message;
    }

    const handleSubmit = async () => {
        if (!content) {
            seterrors(prev => prev.concat("Type contents first"));
            return;
        }
        setloading(true);
        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage());
            typingRef.child(chatRoom.id).child(user.uid).remove();

            setcontent("");
            seterrors([]);
        } catch (error) {
            seterrors(prev => prev.concat(error.message));
            setTimeout(() => {
                seterrors([]);
            }, 5000);
        } finally {
            setloading(false);
        }
    }

    const handleChange = (e) => {
        setcontent(e.target.value);
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const getPath = () => {
        if (isPrivateChatRoom) {
            return `/message/private/${chatRoom.id}`;
        } else {
            return `/message/public/${chatRoom.id}`;
        }
    }

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name) };
        setloading(true);
        try {
            // storage 저장
            let uploadTask = storageRef.child(filePath).put(file, metadata)
            uploadTask.on("state_changed", UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                )
                setpercentage(percentage);
            }, err => { console.error(err); setloading(false); },
                () => {
                    // 저장 후 파일 메시지 db 전송
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL));
                        setloading(false);
                    })
                })
        } catch (error) {
            alert(error.message);
        }
    }
    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.keyCode === 13) {
            handleSubmit();
        }

        if (content) {
            typingRef.child(chatRoom.id).child(user.uid).set(user.displayName)
        } else {
            typingRef.child(chatRoom.id).child(user.uid).remove();
        }
    }

    return (
        <div className="main-panel__message-form">
            <Form onSubmit={handleSubmit}>
                <Form.Group onKeyDown={handleKeyDown} controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" value={content} onChange={handleChange} rows={3} />
                </Form.Group>
            </Form>
            {!(percentage === 0 || percentage === 100) && <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />}
            <div>{errors.map(errorMsg => <p style={{ color: 'red' }} key={errorMsg}>{errorMsg}</p>)}</div>
            <Row>
                <Col>
                    <button onClick={handleSubmit} disabled={loading ? true : false}>Send</button>
                </Col>
                <Col>
                    <button onClick={handleOpenImageRef} disabled={loading ? true : false}>Upload</button>
                </Col>
            </Row>
            <input accept="image/jpeg,image/png" type="file" style={{ display: 'none' }} ref={inputOpenImageRef} onChange={handleUploadImage} />
        </div>
    )
}

export default MessageForm
