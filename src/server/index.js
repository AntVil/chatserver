const express = require('express');
const path = require("path");
const fs = require("fs");
<<<<<<< Updated upstream
const app = express();

//serve webpage on port
const port = 3000;
=======
const http = require('http');
const WebSocket = require('ws');

>>>>>>> Stashed changes

const serverHeartBeat = 5000;
const appPort = 2000;
const serverPort = 2001;
const publicFolderPath = path.join(__dirname, 'public');
const chatFilePath = path.join(__dirname, "chat.txt");


<<<<<<< Updated upstream


/* CONFIGURATING SERVER */
app.use(express.json());
=======
const app = express();
>>>>>>> Stashed changes
app.use(express.static(publicFolderPath));


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

<<<<<<< Updated upstream
/* HANDELING REQUESTS */
app.post("/join", function (req, res) {
  let userProfile = req.body;

  for(let i=0;i<users.length;i++){
    if(users[i].username == userProfile.username){
      res.status(404).send("username taken");
      return;
    }
  }

  let key = "";
  for (let i = 0; i < 8; i++) {
    key += String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }
  userProfile.key = key;
  userProfile.timeStamp = Date.now();

  users.push(userProfile);
=======
>>>>>>> Stashed changes

const USER_NAME = Symbol("username");
const USER_ID = Symbol("userid");
const USER_CONNECTED = Symbol("userconnected");

let onlineUsers = [];

<<<<<<< Updated upstream
app.post("/sendMessage", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("access denied");
  }else{
    let message = "#" + users[userIndex].username + "|" + Date.now() + "|" + users[userIndex].message;
    
    fs.appendFileSync(chatFilePath, message);

    res.send("message sent");
  }
});


app.post("/getMessages", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("access denied");
  }else{
    res.send(fs.readFileSync(chatFilePath));
  }
});


app.post("/getUsers", function (req, res) {
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("access denied");
  }else{
    let userList = "";
    for(let i=0;i<users.length;i++){
      userList += "#" + users[i].username + "|" + users[i].timeStamp;
    }
    res.send(userList);
  }
});


app.post("/leave", function (req, res) {
  let userProfile = req.body;
  
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("user not found");
    return;
  }else{
    users.splice(i, 1);
    res.send("left chat");
  }
});


app.post("/refresh", function(req, res) {
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("user not found");
    return;
  }else{
    users[userIndex].timeStamp = Date.now();
    res.send("refreshed");
  }
});



function kick(){
  //TODO: check 'timeStamp' of users
  //TODO: unregister user
  for(let i=users.length-1;i>=0;i--){
    if(Date.now() - users[i].timeStamp > 10000){
      users.splice(i, 1);
    }
  }
}



/* HILFSFUNKTIONEN */
function getUserIndex(userProfile){
  let userIndex = -1;
  for(let i=0;i<users.length;i++){
    if(users[i].username == userProfile.username && users[i].key == userProfile.key){
      userIndex = i;
      break;
    }
  }
  return userIndex;
}


/* START SERVER */
app.listen(port, () => {
  console.log("serving on port: " + port);
  setInterval(kick, 20000);
});
=======
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
>>>>>>> Stashed changes
