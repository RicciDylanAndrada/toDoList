//jshint esversion:6

const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const app =express();

const date = require(__dirname+"/date.js");

var items=[]
let workItems=[]
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))



app.get("/",function(req,res){

  let day  = date.getDate();





  res.render("list",{listTitle:day,newListItem:items});

})
app.post("/",function(req,res){
  var item = req.body.newItem;



  if(req.body.list =="Work"){
    workItems.push(item)
    res.redirect("/work")
  }else{
    items.push(item);
    res.redirect("/")


  }

});
app.post("/removeTask",function(req,res){
  if (req.body.list ==="Work"){
    workItems = [];
    res.redirect("/work");

  }
  else {
  items = [];
  res.redirect("/");
}
})

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List", newListItem:workItems});

})
// app.post("/work",function(req,res){
//   let item = req.body.newItem;
//   items.push(item);
//   res.redirect("/")
// })




app.listen(3000,function(req,res){
  console.log("Listening");
})
