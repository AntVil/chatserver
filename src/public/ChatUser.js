const CHAT_USER_MESSAGES_SYMBOL = Symbol("messages");
const CHAT_USER_USERS_SYMBOL = Symbol("users");
const CHAT_USER_USERNAME_SYMBOL = Symbol("username");
const TYPE_CHAT_USER_MESSAGE = 0;
const TYPE_CHAT_USER_USERS = 1;
const TYPE_CHAT_USER_CHAT_HISTORY = 2;
const TYPE_CHAT_USER_NAME = 3;

const TYPE_CHAT_SERVER_MESSAGE = 0;
const TYPE_CHAT_SERVER_NAME_CHANGE = 1;

class ChatUser {
    constructor(username, url) {
        this.webSocket = new WebSocket(url);
        this.webSocket[CHAT_USER_USERNAME_SYMBOL] = username;
        this.webSocket[CHAT_USER_MESSAGES_SYMBOL] = [];
        this.webSocket[CHAT_USER_USERS_SYMBOL] = [];

        this.webSocket.onopen = function () {
            this.send(JSON.stringify({
                "type": TYPE_CHAT_SERVER_NAME_CHANGE,
                "data": this[CHAT_USER_USERNAME_SYMBOL]
            }));
        }

        this.webSocket.onmessage = function (event) {
            let message = JSON.parse(event.data);

            if (message.type === TYPE_CHAT_USER_MESSAGE) {
                this[CHAT_USER_MESSAGES_SYMBOL].push(message);

            } else if (message.type === TYPE_CHAT_USER_USERS) {
                this[CHAT_USER_USERS_SYMBOL] = message.data.split("|");

            } else if (message.type === TYPE_CHAT_USER_CHAT_HISTORY) {
                let history = message.data.split("|");
                for(let i=0;i<history.length;i++){
                    if(history[i] !== ""){
                        let message = JSON.parse(history[i]);
                        this[CHAT_USER_MESSAGES_SYMBOL].push(message);
                    }
                }
            }else if(message.type === TYPE_CHAT_USER_NAME){
                this[CHAT_USER_USERNAME_SYMBOL] = message.data;
            }
        }
    }

    getUpdatedUsers() {
        let users = this.webSocket[CHAT_USER_USERS_SYMBOL];
        this.webSocket[CHAT_USER_USERS_SYMBOL] = [];
        return users;
    }

    getNewMessages() {
        let messages = this.webSocket[CHAT_USER_MESSAGES_SYMBOL];
        this.webSocket[CHAT_USER_MESSAGES_SYMBOL] = [];
        return messages;
    }

    sendMessage(message) {
        if (this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify({
                "type": TYPE_CHAT_SERVER_MESSAGE,
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

    getUsername(){
        return this.webSocket[CHAT_USER_USERNAME_SYMBOL];
    }
}