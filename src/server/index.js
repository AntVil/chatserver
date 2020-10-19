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


//configuring Server
app.use(express.json());
app.use(express.static(publicFolderPath));


/* HANDELING REQUESTS */
//handeling join request - calculating key and adding user
app.post("/join", function (req, res) {
  var userProfile = req.body;
  //generating key
  var key = "";
  for (var i = 0; i < 8; i++) {
    key += String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }
  userProfile.key = key;
  userProfile.timeStamp = Date.now();

  //update users
  users.push(userProfile);

  //send key
  res.send(key);
});

//handeling sendMessage request - storing message
app.post("/sendMessage", function (req, res) {
  var userProfile = req.body;

  //TODO: check user
  //TODO: reformat message
  fs.appendFileSync(chatFilePath, userProfile.message);

  res.send("message sent");
});

//handeling getMessages request - sending chat
app.post("/getMessages", function (req, res) {
  //TODO: check user
  res.send(fs.readFileSync(chatFilePath));
});

//handeling leave request - removing user
app.post("/leave", function (req, res) {
  //TODO: check users
  //TODO: update users
  res.send("left chat");
});


//start Server
app.listen(port, () => {
  console.log("serving on port: " + port);
});