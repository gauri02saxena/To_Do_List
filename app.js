const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");

const app = express();
const items = ["Work" , "Eat food" , "Sleep"];
//setting app's view engine to ejs or telling the app to use ejs because by default express uses jade
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
//use public folder for loading static files like css or images etc
app.use(express.static("public"));

app.get("/", function (req, res) {
 
  const day=date.getDate();
  res.render("list", { listTitle: day, newAddedItems: items });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(3000, function (req, res) {
  console.log("Server is running at port 3000");
});
