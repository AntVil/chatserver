const express = require('express');
const path = require("path");
const app = express();
const port = 3000;

//app.use(express.static("../public"));
app.use('/static', express.static(path.join(__dirname, 'public')));

/*
app.post("", function(req, res){

});*/

app.listen(port, () => {
  console.log("serving on port: " + port);
});