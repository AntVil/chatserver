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
app.post("/join", function (req, res) {
  var userProfile = req.body;
  var key = "";
  for (var i = 0; i < 8; i++) {
    key += String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }
  userProfile.key = key;
  userProfile.timeStamp = Date.now();

  users.push(userProfile);

  res.send(key);
});

app.post("/sendMessage", function (req, res) {
  var userProfile = req.body;

  //TODO: check user
  //TODO: reformat message
  fs.appendFileSync(chatFilePath, userProfile.message);

  res.send("message sent");
});


app.post("/getMessages", function (req, res) {
  //TODO: check user
  res.send(fs.readFileSync(chatFilePath));
});

app.post("/leave", function (req, res) {
  //TODO: check users
  //TODO: update users
  res.send("left chat");
});


//start Server
app.listen(port, () => {
  console.log("serving on port: " + port);
});