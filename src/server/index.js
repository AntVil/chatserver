//importing librarys
const express = require('express');
const path = require("path");
const app = express();
const port = 3000;
//filepath to public folder (frontend)
const publicFolderPath = path.join(__dirname, "/../", 'public');

//keeping track of online users
let users = [];

//configuring Server
app.use(express.json());
app.use(express.static(publicFolderPath));

//handeling login request
app.post("/login", function (req, res) {
  var user = req.body;
  //generating key
  var key = "";
  for (var i = 0; i < 8; i++) {
    key += String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }
  user.key = key;

  //update users
  users.push(user);

  //send key
  res.send(key);
});

//handeling submitMessage request - sending message
app.post("/submitMessage", function (req, res) {
  var message = req.body;
  console.log("submitted");

  res.send("message sent");
});

//handeling refreshChat request - sending chat
app.post("/refreshChat", function () {
  console.log("refreshed chat");
  res.send("");
});

//start Server
app.listen(port, () => {
  console.log("serving on port: " + port);
});