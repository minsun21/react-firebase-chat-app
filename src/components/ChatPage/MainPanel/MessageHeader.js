import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from '../../../firebase';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { FaLock, FaLockOpen } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

function MessageHeader({ handleSearchChange }) {
    const user = useSelector(state => state.user.currentUser);
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
    const [isFavorited, setisFavorited] = useState(false);
    const usersRef = firebase.database().ref("users");

    useEffect(() => {
        if (chatRoom && user)
            addFavoriteListener(chatRoom.id, user.uid);
    }, [])
    const addFavoriteListener = (chatRoomId, userId) => {
        usersRef.child(userId).child("favorited").once("value").then(data => {
            if (data.val() !== null) {
                const chatRoomIds = Object.keys(data.val());
                const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
                setisFavorited(isAlreadyFavorited);
            }
        })
    }

    const handleFavorite = () => {
        if (isFavorited) {
            usersRef.child(`${user.uid}/favorited`).child(chatRoom.id).remove(err => {
                if (err != null) {
                    console.log(err);
                }
            })
            setisFavorited(prev => !prev);
        } else {
            usersRef.child(`${user.uid}/favorited`).update({
                [chatRoom.id]: {
                    name: chatRoom.name,
                    desc: chatRoom.desc,
                    createdBy: {
                        name: chatRoom.name,
                        image: chatRoom.createdBy.image
                    }
                }
            })
            setisFavorited(prev => !prev);
        }
    }
    return (
        <div className="main-panel__message-header">
            <Container>
                <Row>
                    <Col>
                        <h2>
                            {isPrivateChatRoom ? <FaLock style={{ marginRight: '3px' }} /> : <FaLockOpen style={{ marginRight: '3px' }} />}
                            {chatRoom && chatRoom.name}
                            {!isPrivateChatRoom &&
                                <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                                    {isFavorited ?
                                        <MdFavorite style={{ marginBottom: '10px' }} />
                                        :
                                        <MdFavoriteBorder style={{ marginBottom: '10px' }} />
                                    }
                                </span>
                            }
                        </h2>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <AiOutlineSearch />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={handleSearchChange}
                                placeholder="Search Message"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <div className="message-header__center">
                    <p>
                        <Image src="" /> {" "}user name
                    </p>
                </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 1rem' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Click me!
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 1rem' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Click me!
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MessageHeader
