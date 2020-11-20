const CHAT_USER_MESSAGES_SYMBOL = Symbol("messages");
const CHAT_USER_USERS_SYMBOL = Symbol("users");
const CHAT_USER_CHAT_MESSAGE = 0;
const CHAT_USER_USERS = 1;
const CHAT_USER_CHAT_HISTORY = 2;

class ChatUser{
    constructor(url){
        this.webSocket = new WebSocket(url);
        this.webSocket[CHAT_USER_MESSAGES_SYMBOL] = [];

        this.webSocket.onmessage = function(event){
            let message = JSON.parse(event.data);
            if(message.type === TYPE_CHAT_MESSAGE){
                this[CHAT_USER_MESSAGES_SYMBOL].push(message);
            }else if(message.type === TYPE_CHAT_USER){
                this[CHAT_USER_USERS_SYMBOL].push(message);
            }else if(message.type === CHAT_USER_CHAT_HISTORY){
                for(let i=0;i<messages.length;i++){
                    this[CHAT_USER_MESSAGES_SYMBOL].push(message);
                }
            }
        }
    }

    getNewMessages(){
        let messages = this.webSocket[CHAT_USER_MESSAGES_SYMBOL];
        this.webSocket[CHAT_USER_MESSAGES_SYMBOL] = [];
        return messages;
    }

    sendMessage(message){
        if(this.webSocket.readyState === WebSocket.OPEN){
            this.webSocket.send(message);
            return true;
        }else{
            return false;
        }
    }

    leave(){
        this.webSocket.close();
    }
}

/*
got messages

{
    chatHistory: [],
    id: String,
    type: int,
    data: "123213123<br>123",
    time: int
}

send messages

{
    type: int,
    userId: String,
    data: String | []
}
*/