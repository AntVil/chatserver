/* VARIABLES */
//importing librarys
const express = require('express');
const path = require("path");
const fs = require("fs");
const app = express();

//serve webpage on port
const port = 3000;

//filepaths
const publicFolderPath = path.join(__dirname, "/../", 'public');
const chatFilePath = path.join(__dirname, "chat.txt");

//keeping track of online users
let users = [];



/* CONFIGURATING SERVER */
app.use(express.json());
app.use(express.static(publicFolderPath));



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

  res.send(key);
});


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