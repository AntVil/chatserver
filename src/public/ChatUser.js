const CHAT_USER_MESSAGES_SYMBOL = Symbol("messages");
const CHAT_USER_USERS_SYMBOL = Symbol("users");
const CHAT_USER_USERNAME_SYMBOL = Symbol("username");
const TYPE_CHAT_USER_MESSAGE = 0;
const TYPE_CHAT_USER_USERS = 1;
const TYPE_CHAT_USER_CHAT_HISTORY = 2;

class ChatUser {
    constructor(username, url) {
        this.webSocket = new WebSocket(url);
        this.webSocket[CHAT_USER_USERNAME_SYMBOL] = username;
        this.webSocket[CHAT_USER_MESSAGES_SYMBOL] = [];

        this.webSocket.onopen = function () {
            this.send(JSON.stringify({
                "type": 0,
                "data": this[CHAT_USER_USERNAME_SYMBOL]
            }));
        }

        this.webSocket.onmessage = function (event) {
            let message = JSON.parse(event.data);

            if (message.type === TYPE_CHAT_USER_MESSAGE) {
                this[CHAT_USER_MESSAGES_SYMBOL].push(message);

            } else if (message.type === TYPE_CHAT_USER_USERS) {
                this[CHAT_USER_USERS_SYMBOL] = message.split("|");

            } else if (message.type === TYPE_CHAT_USER_CHAT_HISTORY) {
                this[CHAT_USER_MESSAGES_SYMBOL] = message.split("|");
            }
        }
    }

    getUsers() {
        return this.webSocket[CHAT_USER_USERS];
    }

    getNewMessages() {
        let messages = this.webSocket[CHAT_USER_MESSAGES_SYMBOL];
        this.webSocket[CHAT_USER_MESSAGES_SYMBOL] = [];
        return messages;
    }

    sendMessage(message) {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify({
                "type": 0,
                "data": message
            }));
            return true;
        } else {
            return false;
        }
    }

    leave() {
        this.webSocket.close();
    }
}

/*
got messages

{
    id: String,        //user id when logging in first time
    type: int,         //type of message
    data: String | [],      //data send; message | chathistory
    time: int,         //time of sending
    user: String    //by who
}

send messages

{
    type: int,
    userId: String,
    data: String | []
}
*/