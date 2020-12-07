const constants = require("./constants");

const fs = require("fs");

let onlineUsers = new Set();


function getTime() {
    let date = new Date();
    return ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
}

function resetChat(){
    fs.writeFileSync(JSON.stringify({
        "type": constants.TYPE_CHAT_USER_MESSAGE,
        "data": "Welcome to the Chat",
        "user": constants.SERVER_NAME,
        "time": getTime()
    }));
}



function sendName(ws) {
    ws.send(JSON.stringify({
        "type": constants.TYPE_CHAT_USER_NAME,
        "data": ws[constants.USER_NAME_SYMBOL]
    }));
}

function sendChathistory(ws) {
    let chatHistory = fs.readFileSync(constants.CHAT_FILE_PATH, "utf-8");
    ws.send(JSON.stringify({
        "type": constants.TYPE_CHAT_USER_CHAT_HISTORY,
        "data": chatHistory
    }));
}

function sendMessageAll(wss, saveMessage, user, time) {
    let json = JSON.stringify({
        "type": constants.TYPE_CHAT_USER_MESSAGE,
        "data": saveMessage,
        "user": user,
        "time": time
    });

    fs.appendFileSync(constants.CHAT_FILE_PATH, "\n|" + json);

    wss.clients.forEach(function (client) {
        client.send(json);
    });
}

function sendOnlineUsersAll(wss) {
    let usernames = [];

    wss.clients.forEach(function (client) {
        usernames.push(client[constants.USER_NAME_SYMBOL])
    });

    let json = JSON.stringify({
        "type": constants.TYPE_CHAT_USER_USERS,
        "data": usernames.join("|")
    });

    wss.clients.forEach(function (client) {
        client.send(json);
    });
}



function addUser(ws, username){
    ws[constants.USER_NAME_SYMBOL] = username;
    onlineUsers.add(ws[constants.USER_NAME_SYMBOL]);
}

function removeUser(ws){
    onlineUsers.delete(ws[constants.USER_NAME_SYMBOL]);
}

function updateUser(ws, username){
    removeUser(ws);
    addUser(ws, username);
}

function validUsername(username){
    return !onlineUsers.has(username);
}


exports.getTime = getTime;

exports.resetChat = resetChat;

exports.sendName = sendName;
exports.sendChathistory = sendChathistory;
exports.sendMessageAll = sendMessageAll;
exports.sendOnlineUsersAll = sendOnlineUsersAll;

exports.addUser = addUser;
exports.removeUser = removeUser;
exports.updateUser = updateUser;
exports.validUsername = validUsername;