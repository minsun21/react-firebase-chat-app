import React, { Component } from 'react'
import { FaRegSmile } from 'react-icons/fa';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

export class DirectMessages extends Component {
    state = {
        usersRef: firebase.database().ref("users"),
        users: [],
        activeChatRoom: ""
    }

    componentDidMount() {
        if (this.props.user)
            this.addUsersListeners(this.props.user.uid);
    }

    addUsersListeners = (currentUserId) => {
        const { usersRef } = this.state;
        let userArray = [];
        usersRef.on("child_added", DataSnapshot => {
            if (currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                userArray.push(user)
                this.setState({ users: userArray })
            }
        })
    }
    getChatRoomId = userUid => {
        const currentUserId = this.props.user.uid;
        return userUid > currentUserId ? `${userUid}/${currentUserId}` : `${currentUserId}/${userUid}`;
    }
    changeChatRoom = user => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name,
        }
        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.setActiveChatRoom(user.uid);
    }
    setActiveChatRoom = userId => {
        this.setState({ activeChatRoom: userId })
    }

    renderDirectMessages = users =>
        users.length > 0 && users.map(user => (<li className={user.uid === this.state.activeChatRoom && 'active'} key={user.uid} onClick={() => this.changeChatRoom(user)}># {user.name}</li>))


    render() {
        const { users } = this.state;
        return (
            <div className="direct-message">
                <span>
                    <FaRegSmile style={{ marginRight: 3 }} /> DIRECT MESSAGES(7)
                </span>
                <ul>
                    {this.renderDirectMessages(users)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessages)
