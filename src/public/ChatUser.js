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
<<<<<<< Updated upstream
            };
            req.onerror = function () {
                reject({
                    status: this.status,
                    statusText: req.statusText
                });
            };
            req.send(sendValue);
        });
    }

    //method for joining the chatroom
    async join() {
        let response = await this.request("POST", "/join", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        this.userProfile.key = response;
    }

    //method for sending a message (requires complete userProfile)
    async sendMessage(message) {
        this.userProfile.message = message;
        let response = await this.request("POST", "/sendMessage", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        return response;
    }

    //method for receiving messages (requires complete userProfile)
    async getMessages() {
        this.userProfile.message = "";
        let response = await this.request("POST", "/getMessages", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        return response;
    }

    //method for receiving users (requires complete userProfile)
    async getUsers() {
        this.userProfile.message = "";
        let response = await this.request("POST", "/getUsers", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        return response;
=======
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
>>>>>>> Stashed changes
    }

    leave(){
        this.webSocket.close();
    }
}