//jshint esversion:6

const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();


const date = require(__dirname + "/date.js");

//var items=[]
let workItems = []
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
}, {
  useUnifiedTopology: true
});
const itemsSchema = {
  name: String
}
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Book1"
});
const item2 = new Item({
  name: "Book2"
});
const item3 = new Item({
  name: "Book3"
});
const defaultItems = [item1, item2, item3];
const listSchema={
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("list",listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});






app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});


app.post("/removeTask", function(req, res) {
  if (req.body.list === "Work") {
    workItems = [];
    res.redirect("/work");

  } else {
    items = [];
    res.redirect("/");
  }
})

app.get("/:categoryType",function(req,res){
  const param = _.capitalize(req.params.categoryType);
  List.findOne({name:param},function(err,foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name:param,
          items:defaultItems
        });

      list.save();
      res.redirect("/"+param)
      }
      else{
        res.render("list",{listTitle:foundList.name,newListItem:foundList.items})
      }
    }
  });





});
app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});


app.listen(3000, function(req, res) {
  console.log("Listening");
})
