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

app.get("/verifier", function (req, res) {
  res.render("pages/verifier");
});

app.listen(3003);
console.log("3003 is the verifier port");
