/* VARIABLES */
//importing librarys
const express = require('express');
const path = require("path");
const fs = require("fs");
const app = express();

//serve webpage on port
const port = 3000;
//used to kick offline users
const serverHeartBeat = 2000;//00;
const clientHeartBeat = 1000;//00;

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

  if (userProfile.username === "") {
    res.send("|username taken|");
    return;
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].username == userProfile.username) {
      res.send("|username taken|");
      return;
    }
  }

  let key = "";
  for (let i = 0; i < 8; i++) {
    key += String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }
  userProfile.key = key;
  users.push(userProfile);
  setTimeStamp(users.length - 1);

  res.send(key);
});


//this function accepts messages and adds them to the chat
app.post("/sendMessage", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if (userIndex == -1) {
    res.send("|user not found|");
  } else {
    setTimeStamp(userIndex);
    
    let message = replaceToHTMLString(userProfile.message);
    if(message.length === 0){
      res.send("message invalid (empty)");
    }else{
      let time = getTime();
      let storedMessage = "#" + userProfile.username + "|" + time + "|" + message + "\n";
  
      fs.appendFileSync(chatFilePath, storedMessage);
  
      res.send("message sent");
    }
  }
});


//this function sends the current chat
//TODO: only send relevant messages
app.post("/getMessages", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if (userIndex == -1) {
    res.send("|user not found|");
  } else {
    setTimeStamp(userIndex);
    res.send(fs.readFileSync(chatFilePath));
  }
});


//this function returns the list of currently online users
app.post("/getUsers", function (req, res) {
  let userProfile = req.body;
  let userIndex = getUserIndex(userProfile);
  if (userIndex == -1) {
    res.send("|user not found|");
  } else {
    setTimeStamp(userIndex);
    let userList = "";
    for (let i = 0; i < users.length; i++) {
      userList += "#" + users[i].username;
    }
    res.send(userList);
  }
});


//this function unregisters a user
app.post("/leave", function (req, res) {
  let userProfile = req.body;

  let userIndex = getUserIndex(userProfile);
  if (userIndex == -1) {
    res.send("|user not found|");
    return;
  } else {
    users.splice(userIndex, 1);
    res.send("left chat");
  }
});



//this function kicks users who were not online for a while
function kick() {
  for (let i = users.length - 1; i >= 0; i--) {
    if (Date.now() - users[i].timeStamp > clientHeartBeat) {
      users.splice(i, 1);
    }
  }
}





/* HELPERFUNCTIONS */
function getUserIndex(userProfile) {
  let userIndex = -1;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == userProfile.username && users[i].key == userProfile.key) {
      userIndex = i;
      break;
    }
  }
  return userIndex;
}

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

function setTimeStamp(userIndex){
  users[userIndex].timeStamp = Date.now();
}


function getTime(){
  let date = new Date();
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  if(hours.length == 1){
    hours = "0" + hours;
  }
  if(minutes.length == 1){
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}


/* START SERVER */
app.listen(port, () => {
  console.log("serving on port: " + port);
  console.log("kicking users every " + serverHeartBeat + "ms, who were not online for " + clientHeartBeat + "ms");
  setInterval(kick, serverHeartBeat);
});