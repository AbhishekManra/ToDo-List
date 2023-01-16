const express = require("express"); // requiring the modules
const bodyparser = require("body-parser"); // requiring the modules
const e = require("express");
const { default: mongoose } = require("mongoose");

const app = express(); // app initialization 
app.use(express.static("public")); 
app.use(bodyparser.urlencoded({extended:true}));

app.set("view engine","ejs");

let list = []; // a free variable to store the list items in it

mongoose.connect("mongodb+srv://AbhishekMan:tricky@cluster0.fnzh3t7.mongodb.net/TODO-list2"); // setting up the connection with our mongodb database

const Item = mongoose.model("Item",{ // our mongoose model to make new documents
    name : String
});

const item1 = new Item({
    name : "Cleaning"
});
const item2 = new Item({
    name : "Sleeping"
});
const item3 = new Item({
    name : "Eating"
});

const item_array = [item1 , item2 , item3];



app.get("/",function(req,res){
    
    Item.find({},function(err,result){
        if(result.length === 0){
            Item.insertMany( item_array , function(err){
                if(err){
                    console.log(err);
                }
            });
            res.redirect("/");
        }else{
            res.render("index",{Header : "Time" , array : result});
        }
    });
});

app.post("/",function(req,res){
    const parsed_data = req.body.inp;
    const button_val = req.body.btn;
    const item_n = new Item({
        name : parsed_data
    });
    if(button_val === "Time"){
        item_n.save();
        res.redirect("/");
    }else{
        List.findOne({name : button_val},function(err,sol){
            if(err){console.log(err);}
            sol.arr.push(item_n);
            sol.save();
            res.redirect("/" + button_val);
        });
    }
});

app.post("/delete",function(req,res){
    const item2remv = req.body.chk;
    const compare = req.body.h_box;
    if(compare === "Time"){
        Item.findByIdAndRemove(item2remv,function(err){
            if(err){
                console.log(err);
            }
        });
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name : compare},{$pull : {arr : {_id : item2remv}}},function(err,result){
            if(!err){
                res.redirect("/"+compare);
            }
        });
    }
});

const List = mongoose.model("List",{
    name : String,
    arr : [{
        name : String
    }]
});



app.get("/:topic",function(req,res){
    const web_name = req.params.topic;
    List.findOne({name : web_name},function(err ,data){
       if(!err){
        if(!data){
            const list = new List({
                name : web_name,
                arr : item_array
            });
            list.save();
            res.redirect("/" + web_name);
        }else{
            res.render("index",{Header : data.name , array : data.arr});
        }
       }
    });
});

app.listen(3000,function(){
    console.log("Running on private Port");
});