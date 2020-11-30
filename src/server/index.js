const constants = require("./constants");
const toHTML = require("./htmlChar");
const sendHelper = require("./sendHelper");

const express = require('express');
const fs = require("fs");
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static(constants.PUBLIC_FOLDER_PATH));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function (ws) {
    ws.on('message', function (obj) {
        let message = JSON.parse(obj);
        message.data = message.data.trim();
        if(message.data.length === 0){
            return;
        }

        if (message.type === constants.TYPE_CHAT_SERVER_MESSAGE) {
            let saveMessage = toHTML.toHTML("" + message.data);
            sendHelper.sendMessageAll(wss, saveMessage, ws[constants.USER_NAME_SYMBOL], sendHelper.getTime());

        } else if (message.type === constants.TYPE_CHAT_SERVER_NAME_CHANGE) {
            let username = toHTML.toHTML("" + message.data);
            if (username.length !== 0 && sendHelper.validUsername(wss, username)) {
                sendHelper.updateUser(ws, username);
                sendHelper.sendName(ws);
                sendHelper.sendOnlineUsersAll(wss);
            }
        }
    });

    ws.on('close', function () {
        sendHelper.removeUser(ws);
        sendHelper.sendMessageAll(wss, `${ws[constants.USER_NAME_SYMBOL]} left the chat`, constants.SERVER_NAME, sendHelper.getTime());
        sendHelper.sendOnlineUsersAll(wss);
    });

    ws.on('error', function () {
        sendHelper.removeUser(ws);
        sendHelper.sendMessageAll(wss, `${ws[constants.USER_NAME_SYMBOL]} left the chat`, constants.SERVER_NAME, sendHelper.getTime());
        sendHelper.sendOnlineUsersAll(wss);
    });

    sendHelper.addUser(ws, `<i>unknown${Date.now()}</i>`);
    sendHelper.sendChathistory(ws);
    sendHelper.sendName(ws);
    sendHelper.sendMessageAll(wss, `a new member joined the chat`, constants.SERVER_NAME, sendHelper.getTime());
    sendHelper.sendOnlineUsersAll(wss);
});



app.listen(constants.WEBPAGE_PORT, constants.HOST_NAME, function () {
    if (fs.readFileSync(constants.CHAT_FILE_PATH, "utf-8").trim().length === 0) {
        sendHelper.resetChat();
    }
    console.log(`serving HTML on port ${constants.WEBPAGE_PORT}.`);
});

server.listen(constants.WEBSOCKET_PORT, constants.HOST_NAME, function () {
    console.log(`serving WS on port ${constants.WEBSOCKET_PORT}`);
});
