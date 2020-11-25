const constants = require("./constants");
const globals = require("./globals");
const toHTML = require("./htmlChar");
const sendHelper = require("./sendHelper");

const express = require('express');
const fs = require("fs");
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static(constants.publicFolderPath));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function (ws) {
  ws[constants.USER_NAME] = `<i>unknown${Date.now()}</i>`;
  ws[constants.USER_CONNECTED] = true;

  ws.on('message', function (obj) {
    let message = JSON.parse(obj);

    if (message.type === constants.TYPE_CHAT_SERVER_MESSAGE) {
      let saveMessage = toHTML.toHTML("" + message.data);
      sendHelper.sendMessageAll(wss, saveMessage, ws[constants.USER_NAME], sendHelper.getTime());

    } else if (message.type === constants.TYPE_CHAT_SERVER_NAME_CHANGE) {
      let username = toHTML.toHTML("" + message.data);
      if (username.length !== 0 && !globals.onlineUsers.includes(username)) {
        ws[constants.USER_NAME] = username;
        sendHelper.sendName(ws);
        sendHelper.sendOnlineUsers(wss);
      }
    }
  });

  ws.on('close', function (){
    sendHelper.sendMessageAll(wss, `${ws[constants.USER_NAME]} left the chat`, "<i>server</i>", sendHelper.getTime());
    sendHelper.sendOnlineUsers(wss);
  });

  sendHelper.sendChathistory(ws);
  sendHelper.sendName(ws);
  sendHelper.sendMessageAll(wss, `a new member joined the chat`, "<i>server</i>", sendHelper.getTime());
  sendHelper.sendOnlineUsers(wss);
});



app.listen(constants.appPort, function () {
  if (fs.readFileSync(constants.chatFilePath, "utf-8").trim().length === 0) {
    fs.writeFileSync(constants.chatFilePath, `{"type":0,"data":"Welcome to the Chat","user":"<i>server</i>","time":"${sendHelper.getTime()}"}`);
  }
  console.log(`serving on port ${constants.appPort}.`);
});

server.listen(constants.serverPort, function () {
  console.log(`serving on port ${constants.serverPort}`);
});
