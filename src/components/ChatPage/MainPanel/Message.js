import React from 'react'
import Media from 'react-bootstrap/Media';
import moment from 'moment';

function Message({ message, user }) {
    const timeFromNow = timestamp => moment(timestamp).fromNow();

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }
    const isMessageMine = (message, user) => {
        return message.user.id === user.uid;
    }

    return (
        <Media className="message-box__message">
            <img
                className="user-img"
                width={48}
                height={48}
                className="mr-3"
                src={message.user.image}
                alt={message.user.name}
            />
            <Media.Body style={{ backgroundColor: isMessageMine(message, user) && "#ececec" }}>
                <h6>{message.user.name}<span>{timeFromNow(message.timestamp)}</span></h6>
                {isImage(message)
                    ? <img className="message-img" src={message.image} />
                    : <p>
                        {message.content}
                    </p>}
            </Media.Body>
        </Media>
    )
}

export default Message
