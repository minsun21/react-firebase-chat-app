import React, { Component } from 'react'
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import Message from './Message';

export class MainPanel extends Component {
    state = {
        messages: [],
        messagesRef: firebase.database().ref("messages"),
        messagesLoading: true
    }

    componentDidMount() {
        const { chatRoom } = this.props;
        if (chatRoom) {
            this.addMessagesListeners(chatRoom.id)
        }
    }
    addMessagesListeners = (chatRoomId) => {
        let messagesArray = [];
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messagesLoading: false
            })
        })
    }
    renderMessages = (messgaes) => messgaes.length > 0 && messgaes.map(message => (<Message key={message.timestamp} message={message} user={this.props.user} />))

    render() {
        const { messages } = this.state;
        return (
            <div className="main-panel__body">
                <MessageHeader />
                <div className="main-panel__message-box">
                    {this.renderMessages(messages)}
                </div>
                <MessageForm />
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
export default connect(mapStateToProps)(MainPanel)
