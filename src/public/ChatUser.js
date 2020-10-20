//A class for handeling client->server interactions
class ChatUser {
    constructor(username) {
        //profile which is sent to the server
        this.userProfile = {
            username: username,
            key: "",
            message: ""
        };

        this.join();
    }

    //method for sending requests
    request(method, url, headerName, headerValue, sendValue) {
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();
            req.open(method, url, true);
            req.setRequestHeader(headerName, headerValue);

            req.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(req.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: req.statusText
                    });
                }
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
    }

    //method for leaving the chatroom (requires complete userProfile)
    async leave() {
        this.userProfile.message = "";
        let response = await this.request("POST", "/leave", "Content-Type", "application/json", JSON.stringify(this.userProfile));
    }
}