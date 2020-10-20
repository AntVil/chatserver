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
  //TODO: check user
  let message = userProfile.message;
  //TODO: reformat message
  fs.appendFileSync(chatFilePath, message);

  res.send("message sent");
});

app.post("/getMessages", function (req, res) {
  //TODO: check user
  res.send(fs.readFileSync(chatFilePath));
});

app.post("/getUsers", function (req, res) {
  //TODO: check user
  let userList = "";
  //TODO: reformat userList

  res.send(userList);
});

app.post("/leave", function (req, res) {
  //TODO: check users
  //TODO: update users
  res.send("left chat");
});



/* START SERVER */
app.listen(port, () => {
  console.log("serving on port: " + port);
});