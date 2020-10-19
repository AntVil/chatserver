let userProfile = {};

function joinConversation() {
    let username = document.getElementById("username").value;

    let joinRequest = new XMLHttpRequest();
    joinRequest.open('POST', "/login", true);
    joinRequest.setRequestHeader('Content-Type', 'application/json');

    joinRequest.onload = function () { 
        chatKey = joinRequest.responseText;
        user.key = chatKey;
    };

    joinRequest.onerror = function () {
        return;
    };

    joinRequest.send(JSON.stringify({
        "username": username
    }));
}

function sendMessage(){
    let message = {
        username: userProfile.username,
        key: userProfile.key,
        message: "test Message!"
    };
    let messageRequest = new XMLHttpRequest();
    messageRequest.open('POST', "/submitMessage", true);
    messageRequest.setRequestHeader('Content-Type', 'application/json');

    messageRequest.onload = function () { 
        chatKey = joinRequest.responseText;
        user.key = chatKey;
    };

    messageRequest.onerror = function () {
        return;
    };

    messageRequest.send(JSON.stringify(message));
}