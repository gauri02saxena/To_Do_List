const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//setting app's view engine to ejs or telling the app to use ejs because by default express uses jade
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
//use public folder for loading static files like css or images etc
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/todolistDB", { useNewUrlParser: true });

//Items Schema
const itemsSchema = {
  name: String,
};

//Item Model
const Item = mongoose.model("Item", itemsSchema);

//Item Documents
const item1 = new Item({
  name: "Wake up",
});

const item2 = new Item({
  name: "Take a bath",
});

const item3 = new Item({
  name: "Have breakfast",
});

//List Schema
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const defaultItems = [item1, item2, item3];

//List Model
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  //Reading data from DB
  //foundItems is the DB data which is an array of objects
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        //Inserting to DB

        Item.insertMany(defaultItems)
          .then(() => console.log("Succesfully added defaultItems to DB"))
          .catch((err) => console.log(err));
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newAddedItems: foundItems });
      }
    })
    .catch((err) => console.log(err));
});

//Creating dynamic routes through express routing parameters
app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  //Checking if the default list items are present in the new list or not
  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        //Create default list
        //Using same items in the List model as Item model
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        //Reloading the page to display the list on the browser
        res.redirect("/" + customListName);
      } else {
        //Show existing list
        res.render("list", {
          listTitle: foundList.name,
          newAddedItems: foundList.items,
        });
      }
    })
    .catch((err) => console.log(err));
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.submit;

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    newItem.save();

    res.redirect("/");
  }

  else{
    List.findOne({name: listName})
    .then((foundList)=>{
      foundList.items.push(newItem),
      foundList.save(),
      res.redirect("/"+listName)
    });
  }
    
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      console.log("Successfully deleted item");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.listen(3000, function (req, res) {
  console.log("Server is running at port 3000");
});
