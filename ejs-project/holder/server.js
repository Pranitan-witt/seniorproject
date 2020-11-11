var express = require("express");
var app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/holder", function (req, res) {
  res.render("pages/holder");
});

app.listen(3000);
console.log("3000 is the magic port");
