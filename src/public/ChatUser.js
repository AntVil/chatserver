class ChatUser {
    constructor(username) {
        this.userProfile = {
            username: username,
            key: "",
            message: ""
        };

        this.join();
    }

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

    async join() {
        let response = await this.request("POST", "/join", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        this.userProfile.key = response;
    }

    async sendMessage(message) {
        this.userProfile.message = message;
        let response = await this.request("POST", "/sendMessage", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        return response;
    }

    async getMessages() {
        this.userProfile.message = "";
        let response = await this.request("POST", "/getMessages", "Content-Type", "application/json", JSON.stringify(this.userProfile));
        return response;
    }

    async leave() {
        this.userProfile.message = "";
        let response = await this.request("POST", "/leave", "Content-Type", "application/json", JSON.stringify(this.userProfile));
    }
}