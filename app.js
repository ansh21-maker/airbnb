const express = require("express");
const mongoose = require("mongoose");
const app = express();
const DataList=require("./models/listings");
const PORT = 9090;


//setup for ejs

const path=require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//set router of listing

app.get("/listings",async(req,res)=>{
    try{
        const listings=await DataList.find({});
        res.render("index",{listings});
    }
    catch(err){
        console.log(err);
    }
})



// show routes


app.get("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    let listings=await DataList.findById(id);
    res.render("show",{listings});

})


//creat a server and database

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Meta");
    app.listen(PORT, () => {
      console.log(`server listing on port ${PORT}`);
      
    });
  } catch (err) {
    console.log(err);
  }
}
main();

app.get("/", (req, res) => {
  res.send("helo world");
});
