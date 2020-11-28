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
        messagesLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false
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

    handleSearch = () => {
        const chatRoomMessages = [...this.state.message];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({ searchResults });
    }

    handleSearchChange = (e) => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true
        },
            () => this.handleSearch()
        )
    }
    render() {
        const { messages, searchTerm, searchResults } = this.state;
        return (
            <div className="main-panel__body">
                <MessageHeader handleSearchChange={this.handleSearchChange} />
                <div className="main-panel__message-box">
                    {searchTerm ? this.renderMessages(searchResults) : this.renderMessages(messages)}

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
