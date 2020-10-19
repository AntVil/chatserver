const express = require('express');
const path = require("path");
const app = express();
const port = 3000;
const publicFolderPath = path.join(__dirname, "/../", 'public');

var users = [];

app.use(express.json());
app.use(express.static(publicFolderPath));


app.post("/login", function (req, res) { 
  var user = req.body;
  var key = "";
  for(var i=0;i<8;i++){
    key += String.fromCharCode(Math.floor(Math.random() * 26 + 65));
  }
  user.key = key;
  
  users.push(user);

  console.log(users);
  
  res.send(chatKey);
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