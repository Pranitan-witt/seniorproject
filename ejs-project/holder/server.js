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
  var title = "Holder";
  var list = [1, 2, 3, 4, 5];
  var i = 0;
  var mock_up_data = [
    "นายประณิธาน วิทยารณยุทธ",
    "CP463 Artificial Intelligence",
    "A",
  ];

  res.render("pages/holder", {
    title: title,
    list: list,
    mock_up_data: mock_up_data,
  });
});

app.listen(3001);
console.log("3001 is the holder port");
