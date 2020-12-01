import React, { Component } from 'react'
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
import { FaRegSmileBeam } from 'react-icons/fa';
import firebase from '../../../firebase';



export class Favorited extends Component {
    state = {
        favoritedChatRooms: [],
        usersRef: firebase.database().ref("users"),
        activeChatRoomId: ''
    }

    componentDidMount() {
        if (this.props.user)
            this.addListeners(this.props.user.uid);
    }

    componentWillUnmount() {
        if (this.props.user) {
            this.removeListener(this.props.user.uid);
        }
    }
    removeListener = (userId) => {
        this.state.usersRef.child(`${userId}/favorited`).off();
    }

    addListeners = (userId) => {
        const { usersRef } = this.state;
        usersRef
            .child(userId)
            .child("favorited")
            .on("child_added", DataSnapshot => {
                const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val() }
                this.setState({
                    favoritedChatRooms: [...this.state.favoritedChatRooms, favoritedChatRoom]
                })
            });
        usersRef
            .child(userId)
            .child("favorited")
            .on("child_removed", DataSnapshot => {
                const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val() }
                const filtedChatRooms = this.state.favoritedChatRooms.filter(chatRoom => {
                    return chatRoom.id !== chatRoomToRemove.id;
                })
                this.setState({
                    favoritedChatRooms: filtedChatRooms
                })
            });
    }

    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({ activeChatRoomId: room.id });
    }

    renderFavoritedChatRooms = favoritedChatRooms =>
        favoritedChatRooms.length > 0 &&
        favoritedChatRooms.map(chatRoom => (<li style={{ cursor: 'pointer' }} key={chatRoom.id} onClick={() => this.changeChatRoom(chatRoom)} className={chatRoom.id === this.state.activeChatRoomId && 'active'}>{chatRoom.name}</li>))

    render() {
        const { favoritedChatRooms } = this.state;
        return (
            <div className="favorited-panel">
                <span>
                    <FaRegSmileBeam style={{ marginRight: '3px' }} />
                FAVORITED ({favoritedChatRooms.length})
            </span>
                <ul>
                    {this.renderFavoritedChatRooms(favoritedChatRooms)}
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
export default connect(mapStateToProps)(Favorited)