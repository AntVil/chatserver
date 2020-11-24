const express = require('express');
const path = require("path");
const fs = require("fs");
const http = require('http');
const WebSocket = require('ws');

const serverHeartBeat = 2000;
const appPort = 2000;
const serverPort = 2001;
const publicFolderPath = path.join(__dirname, "/../", 'public');
const chatFilePath = path.join(__dirname, "chat.txt");

const app = express();
app.use(express.static(publicFolderPath));


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const USER_NAME = Symbol("username");
const USER_CONNECTED = Symbol("userconnected");

const TYPE_CHAT_USER_MESSAGE = 0;
const TYPE_CHAT_USER_USERS = 1;
const TYPE_CHAT_USER_CHAT_HISTORY = 2;
const TYPE_CHAT_USER_NAME = 3;

const TYPE_CHAT_SERVER_MESSAGE = 0;
const TYPE_CHAT_SERVER_NAME_CHANGE = 1;

let onlineUsers = [];

wss.on('connection', function (ws) {


  ws[USER_NAME] = `<i>unknown${Date.now()}</i>`;
  ws[USER_CONNECTED] = true;

  ws.on('pong', function () {
    ws[USER_CONNECTED] = true;
  });

  ws.on('message', function (obj) {
    let message = JSON.parse(obj);

    if(message.type === TYPE_CHAT_SERVER_MESSAGE){
      let saveMessage = replaceToHTMLString("" + message.data);

      let date = new Date();
      let time = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);

      let json = JSON.stringify({
        "type": TYPE_CHAT_USER_MESSAGE,
        "data": saveMessage,
        "user": ws[USER_NAME],
        "time": time
      });

      fs.appendFileSync(chatFilePath, "\n|" + json);

      wss.clients.forEach(function(client) {
        client.send(json);
      });
      
    }else if(message.type === TYPE_CHAT_SERVER_NAME_CHANGE){
      let username = replaceToHTMLString("" + message.data).trim();
      if(username.length !== 0 && validName(username)){
        ws[USER_NAME] = username;
        ws.send(JSON.stringify({
          "type": TYPE_CHAT_USER_NAME,
          "data": ws[USER_NAME]
        }));
      }
    }
  });

  let chatHistory = fs.readFileSync(chatFilePath, "utf-8");
  ws.send(JSON.stringify({
    "type": TYPE_CHAT_USER_CHAT_HISTORY,
    "data": chatHistory
  }));
  ws.send(JSON.stringify({
    "type": TYPE_CHAT_USER_NAME,
    "data": ws[USER_NAME]
  }));
});


function replaceToHTMLString(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += replaceToHTMLChar(str[i]);
  }
  return result;
}

function replaceToHTMLChar(char) {
  let specialChars = ["&", "<", ">", "#", "|", '"', "'", "´", "!", "\n", "{", "}", "(", ")", "[", "]"];
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
    "\n": "<br>",
    "{": "&lbrace;", 
    "}": "&rbrace;", 
    "(": "&lpar;", 
    ")": "&rpar;", 
    "[": "&lbrack;", 
    "]": "&rbrack;"

  }
  if (specialChars.includes(char)) {
    return specialCharDict[char];
  } else {
    return char;
  }
}


function validName(name){
  return !onlineUsers.includes(name);
}



app.listen(appPort, function () {
  if(fs.readFileSync(chatFilePath, "utf-8").trim().length === 0){
    fs.writeFileSync(chatFilePath, `{"type":0,"data":"Welcome to the Chat","user":"","time":""}`);

  }
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
      onlineUsers.push(client[USER_NAME]);
      //console.log(client[USER_NAME]);
      client[USER_CONNECTED] = false;
      client.ping(null, false, true);
    }
  });

  let json = JSON.stringify({
    "type": TYPE_CHAT_USER_USERS,
    "data": onlineUsers.join("|")
  });

  
  wss.clients.forEach(function(client) {
    client.send(json);
  });

}, serverHeartBeat);
