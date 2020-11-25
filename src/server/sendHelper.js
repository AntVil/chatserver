const constants = require("./constants");
const globals = require("./globals");

const fs = require("fs");


function sendOnlineUsers(wss) {
    let usernames = [];

    wss.clients.forEach(function (client) {
        usernames.push(client[constants.USER_NAME])
    });

    let json = JSON.stringify({
        "type": constants.TYPE_CHAT_USER_USERS,
        "data": usernames.join("|")
    });

    wss.clients.forEach(function (client) {
        client.send(json);
    });
}


function sendMessageAll(wss, saveMessage, user, time) {
    let json = JSON.stringify({
        "type": constants.TYPE_CHAT_USER_MESSAGE,
        "data": saveMessage,
        "user": user,
        "time": time
    });

    fs.appendFileSync(constants.chatFilePath, "\n|" + json);

    wss.clients.forEach(function (client) {
        client.send(json);
    });
}


function getTime() {
    let date = new Date();
    return ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
}


function sendChathistory(ws) {
    let chatHistory = fs.readFileSync(constants.chatFilePath, "utf-8");
    ws.send(JSON.stringify({
        "type": constants.TYPE_CHAT_USER_CHAT_HISTORY,
        "data": chatHistory
    }));
}

function sendName(ws) {
    ws.send(JSON.stringify({
        "type": constants.TYPE_CHAT_USER_NAME,
        "data": ws[constants.USER_NAME]
    }));
}

exports.sendOnlineUsers = sendOnlineUsers;
exports.sendMessageAll = sendMessageAll;
exports.getTime = getTime;
exports.sendChathistory = sendChathistory;
exports.sendName = sendName;