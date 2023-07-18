const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();


//setting app's view engine to ejs or telling the app to use ejs because by default express uses jade
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
//use public folder for loading static files like css or images etc
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1/todolistDB", {useNewUrlParser:true});

//Schema
const itemsSchema= {
  name: String
};

//Model
const Item= mongoose.model("Item", itemsSchema);

//Documents
const item1= new Item({
  name:"Wake up"
});

const item2= new Item({
  name : "Take a bath"
});


const item3= new Item({
  name : "Have breakfast"
});


app.get("/", function (req, res) {


  //Reading data from DB
  //foundItems is the DB data which is an array of objects
  Item.find({})
  .then((foundItems)=> {
    if(foundItems.length===0){
      //Inserting to DB
        const defaultIteams=[item1,item2,item3];
        Item.insertMany(defaultIteams)
        .then(()=> console.log("Succesfully added defaultItems to DB"))
        .catch((err)=>console.log(err));
        res.redirect("/");

    }
    else{
      res.render("list", { listTitle: "Today", newAddedItems: foundItems });

    }
  }).catch((err)=>console.log(err));
 
  
  
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const newItem= new Item({
    name : itemName
  });

  newItem.save();

  res.redirect("/");
 
});

app.post("/delete", function(req,res){
  const checkedItemId=req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
  .then(()=>{console.log("Successfully deleted item"); res.redirect("/");})
  .catch((err)=>console.log(err));
});

app.listen(3000, function (req, res) {
  console.log("Server is running at port 3000");
});
