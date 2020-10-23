/* VARIABLES */
//importing librarys
const express = require('express');
const path = require("path");
const fs = require("fs");
const app = express();

//serve webpage on port
const port = 3000;
//used to kick offline users
const serverHeartBeat = 20000;
const clientHeartBeat = 10000;

//filepaths
const publicFolderPath = path.join(__dirname, "/../", 'public');
const chatFilePath = path.join(__dirname, "chat.txt");

//keeping track of online users
let users = [];



/* CONFIGURATING SERVER */
app.use(express.json());
app.use(express.static(publicFolderPath));



/* HANDELING REQUESTS */
//this function allows users to join the chat
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

  res.send(key);
});

//this function accepts messages and adds them to the chat
app.post("/sendMessage", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("access denied");
  }else{
    let message = replaceToHTMLString(userProfile.message);
    
    let date = new Date();
    let time = date.getHours() + ":" + date.getMinutes();
    let storedMessage = "#" + userProfile.username + "|" + time + "|" + message + "\n";
    
    fs.appendFileSync(chatFilePath, storedMessage);

    res.send("message sent");
  }
});

//this function sends the current chat
//TODO: only send relevant messages
app.post("/getMessages", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("access denied");
  }else{
    res.send(fs.readFileSync(chatFilePath));
  }
});

//this function returns the list of currently online users
app.post("/getUsers", function (req, res) {
  let userProfile = req.body;
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

//this function unregisters a user
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


//this function refreshes the timeStamp which is used to determine if a user should be kicked
app.post("/refresh", function(req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if(userIndex == -1){
    res.status(404).send("user not found");
    return;
  }else{
    users[userIndex].timeStamp = Date.now();
    res.send("refreshed");
  }
});


//this function kicks users who were not online for a while
function kick(){
  for(let i=users.length-1;i>=0;i--){
    if(Date.now() - users[i].timeStamp > clientHeartBeat){
      users.splice(i, 1);
    }
  }
}



/* HELPERFUNCTIONS */
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

function replaceToHTMLString(str){
  let result = "";
  for(let i=0;i<str.length;i++){
    result += replaceToHTMLChar(str[i]);
  }
  return result;
}

function replaceToHTMLChar(char){
  let specialChars = ["&", "<", ">", "#", "|", '"', "'", "´", "!"];
  let specialCharDict = {
    "&": "&amp",
    "<": "&lt;",
    ">": "&gt;",
    "#": "&num;",
    "|": "&vert;",
    '"': "&quot",
    "'": "&apos;",
    "´": "&acute;",
    "!": "&excl;"
  }
  if(specialChars.includes(char)){
    return specialCharDict[char];
  }else{
    return char;
  }
}


/* START SERVER */
app.listen(port, () => {
  console.log("serving on port: " + port);
  console.log("kicking users every " + serverHeartBeat + "ms, who were not online for " + clientHeartBeat + "ms");
  setInterval(kick, serverHeartBeat);
});