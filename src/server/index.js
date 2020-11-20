const express = require('express');
const path = require("path");
const fs = require("fs");
const http = require('http');
const WebSocket = require('ws');


const serverHeartBeat = 5000;
const appPort = 2000;
const serverPort = 2001;
const publicFolderPath = path.join(__dirname, "/../", 'public');
const chatFilePath = path.join(__dirname, "chat.txt");


const app = express();
app.use(express.static(publicFolderPath));


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const USER_NAME = Symbol("username");
const USER_ID = Symbol("userid");
const USER_CONNECTED = Symbol("userconnected");

let onlineUsers = [];

wss.on('connection', function (ws) {

  ws[USER_NAME] = "";
  ws[USER_ID] = "" + Math.floor(Math.random() * 100000 + 900000);
  ws[USER_CONNECTED] = true;

  ws.on('pong', function () {
    ws[USER_CONNECTED] = true;
  });

  ws.on('message', function (prefixMessage) {
    if(prefixMessage.startsWith("setUsername")){
      let username = prefixMessage.split("setUsername")[1];
      ws[USER_NAME] = replaceToHTMLString(username);
    }else if(prefixMessage.startsWith("getUsers")){
      ws.send(onlineUsers);
    }else if(prefixMessage.startsWith("sendMessage")){
      let message = message.split("prefixMessage")[i];
      let saveMessage = replaceToHTMLString(message);

      fs.appendFileSync(chatFilePath, saveMessage);
  
      wss.clients.forEach(function(client) {
        client.send(saveMessage);
      });
    }
  });

  let chatHistory = fs.readFileSync(chatFilePath, "utf-8");
  ws.send(chatHistory);
  ws.send(ws[USER_ID]);
});



function replaceToHTMLString(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += replaceToHTMLChar(str[i]);
  }
  return result;
}

function replaceToHTMLChar(char) {
  let specialChars = ["&", "<", ">", "#", "|", '"', "'", "´", "!", "\n"];
  let specialCharDict = {
    "&": "&amp",
    "<": "&lt;",
    ">": "&gt;",
    "#": "&num;",
    "|": "&vert;",
    '"': "&quot",
    "'": "&apos;",
    "´": "&acute;",
    "!": "&excl;",
    "\n": "<br>"
  }
  if (specialChars.includes(char)) {
    return specialCharDict[char];
  } else {
    return char;
  }
}




app.listen(appPort, function () {
  console.log(`serving on port ${appPort}.`);
});

server.listen(serverPort, function() {
  console.log(`serving on port ${serverPort}`);
});


setInterval(function () {
  onlineUsers = [];

  wss.clients.forEach(function(client) {
    if (!client[USER_CONNECTED]) {
      client.terminate();
    }else{
      client[USER_CONNECTED] = false;
      client.ping(null, false, true);
    }
  });
}, serverHeartBeat);
