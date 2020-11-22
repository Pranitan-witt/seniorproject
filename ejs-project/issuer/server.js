var express = require("express");
var app = express();
const title = "Issuer";

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  res.render("pages/index", {
    title: title,
  });
});

app.get("/issuer", function (req, res) {
  res.render("pages/issuer", {
    title: title,
  });
});

app.listen(3002);
console.log("3002 is the issuer port");
