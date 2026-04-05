const express = require("express");
const mongoose = require("mongoose");
const app = express();
const DataList=require("./models/listings");
const PORT = 9090;
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");


//setup for ejs

const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(methodOverride("_method")); 
app.engine("ejs", ejsMate);   






//update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;

  await DataList.findByIdAndUpdate(id, { ...req.body.newData });

  res.redirect("/listings");
});


//delete route


app.delete("/listings/:id",async(req, res)=>{
  let { id } = req.params;
  let deletedListing=await DataList.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings")
})

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


//add new item

app.get("/listings/new",(req,res)=>{
    res.render("new");
})

app.post("/listings", async(req,res)=>{
try{
console.log(req.body);
  let data =req.body.newData;
   data.image = {
      url: data.image,
      filename: "listingimage"
    };
  let formNewData=new DataList(data);
  
  await formNewData.save();

  res.redirect("/listings")
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


//edit routes


app.get("/listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
   let listings=await DataList.findById(id);
   res.render("edit",{listings})
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
