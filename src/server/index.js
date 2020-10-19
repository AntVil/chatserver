const express = require('express');
const path = require("path");
const app = express();
const port = 3000;
const publicFolderPath = path.join(__dirname, "/../", 'public');
const chatKey = "123";

var users = [];

app.use(express.static(publicFolderPath));


app.post("/login", function (req, res) {
  console.log("logged in");

  users.push();
  
  res.send();
});

app.post("/submit", function (req, res) {
  console.log("submitted");
  res.send();
});

app.post("/refreshChat", function(){
  console.log("refreshed chat");
  res.send();
})

app.listen(port, () => {
  console.log("serving on port: " + port);
});