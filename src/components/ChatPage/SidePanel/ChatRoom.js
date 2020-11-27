import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';


export class ChatRoom extends Component {
    state = {
        show: false,
        name: "",
        desc: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: ""
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        this.state.chatRoomsRef.off();
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
            this.setState({ chatRooms: chatRoomsArray }, () => this.setFirstChatRoom())
        })
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
        this.setState({ activeChatRoomId: room.id })
    }

    renderChatRooms = (chatRooms) =>
        chatRooms.length > 0 && chatRooms.map(room => (<li className={room.id === this.state.activeChatRoomId && 'active-li'} key={room.id} onClick={() => this.changeChatRoom(room)}># {room.name}</li>))

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
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(ChatRoom)
