import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
import Badge from 'react-bootstrap/Badge';

export class ChatRoom extends Component {
    state = {
        show: false,
        name: "",
        desc: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        messagesRef: firebase.database().ref("messages"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: "",
        notifications: []
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRoomsRef.off();
        this.state.chatRooms.forEach(chatRoom => {
            this.state.messagesRef.child(chatRoom.id).off();
        })
    }

    setFirstChatRoom = () => {
        if (this.state.firstLoad && this.state.chatRooms.length > 0) {
            const firstChatRoom = this.state.chatRooms[0];
            this.props.dispatch(setCurrentChatRoom(firstChatRoom));
            this.setState({ activeChatRoomId: firstChatRoom.id });
        }
        this.setState({ firstLoad: false });
    }

    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];

        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray }, () => this.setFirstChatRoom());
            this.addNotificationListener(DataSnapshot.key);
        })
    }

    addNotificationListener = (chatRoomId) => {
        this.state.messagesRef.child(chatRoomId).on("value", DataSnapshot => {
            if (this.props.chatRoom) {
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot
                )
            }
        })
    }

    handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === chatRoomId);
        // notifications안에 해당 채팅방의 알림 정보가 없을 때
        if (index === -1) {
            notifications.push({
                id: chatRoomId,
                total: DataSnapshot.numChildren(), // 전체 메시지 개수
                lastKnownTotal: DataSnapshot.numChildren(),  // 이전에 확인한 메시지 개수.
                count: 0
            })
        } else {
            // 이미 해당 채팅방에 알림 정보가 있을 때
            if (chatRoomId !== currentChatRoomId) {
                // 현재까지 유저가 확인한 메시지 개수
                lastTotal = notifications[index].lastKnownTotal;
                if (DataSnapshot.numChildren() - lastTotal > 0) {
                    notifications[index].count = DataSnapshot.numChildren() - lastTotal;
                }
            }
            // total property에 현재 전체 메시지 개수 넣어주기
            notifications[index].total = DataSnapshot.numChildren();
        }
        // 방 하나하나의 맞는 알림 정보 넣어주기
        this.setState({ notifications });
    }


    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    handleSubmit = (e) => {
        e.preventDefault();
        const { name, desc } = this.state;

        if (this.isFormValid(name, desc)) {
            this.addChatRoom();
        }
    }

    isFormValid = (name, desc) => name && desc;

    addChatRoom = async () => {
        const key = this.state.chatRoomsRef.push().key;
        const { name, desc } = this.state;
        const { user } = this.props;
        const newChatRoom = {
            id: key,
            name: name,
            desc: desc,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        }
        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom);
            this.setState({
                name: "",
                desc: "",
                show: false
            })
        } catch (error) {
            alert(error);
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({ activeChatRoomId: room.id });
        this.clearNotifications();
    }

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.props.chatRoom.id);
        if (index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
            updatedNotifications.count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }

    getNotificationCount = room => {
        // 해당 채팅방의 count 수 구하기
        let count = 0;
        this.state.notifications.forEach(notification => {
            if (notification.id === room.id) {
                count = notification.count;
            }
        })
        if (count > 0) return count;
    }

    renderChatRooms = (chatRooms) =>
        chatRooms.length > 0 && chatRooms.map(room => (<li className={room.id === this.state.activeChatRoomId && 'active-li'} key={room.id} onClick={
            () => this.changeChatRoom(room)}>
            # {room.name}
            <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">{this.getNotificationCount(room)}</Badge>
        </li>))

    render() {
        return (
            <div className="side-panel__chat-room">
                <div className="chat-room_header">
                    <FaRegSmileWink style={{ marginRight: 3 }} />
                    CHAT ROOMS(1) {" "}
                    <FaPlus onClick={this.handleShow} style={{ position: 'absolute', right: 0, cursor: 'pointer' }} />
                </div>

                <ul>
                    {this.renderChatRooms(this.state.chatRooms)}
                </ul>
                {/* MODAL */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>방 이름</Form.Label>
                                <Form.Control name="name" onChange={this.onChange} type="text" placeholder="Enter a chat room name" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>방 설명</Form.Label>
                                <Form.Control name="desc" onChange={this.onChange} type="text" placeholder="Enter a chat room description" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Create
                        </Button>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps)(ChatRoom)
