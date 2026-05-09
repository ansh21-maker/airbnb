const express = require("express");
const mongoose = require("mongoose");
const app = express();
const listingRouter = require("./routes/listings");
const DataList=require("./models/listings");
const PORT = 9090;
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const Review=require("./models/reviews");
const session = require('express-session');
const flash = require('connect-flash');








//setup for ejs

const path=require("path");
const constants = require("constants");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(methodOverride("_method")); 
app.engine("ejs", ejsMate);   








//connect sessions
const sessionOptions = {
  secret: "mysecretsessioncode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

app.get("/", (req, res) => {
  res.send("helo world");
});


app.use(session(sessionOptions));
app.use(flash());

//flash message
app.use((req, res, next)=>{
  res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");

  next();
})

app.use("/listings", listingRouter);








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
  res.redirect("/listings");
  }
  catch(err){
console.log(err);
  }
})


function wrapAsync(fn){
  return function(req,res,next){
    fn(req,res,next).catch(next);
  }
}


// show routes


app.get(
  "/listings/:id",
 wrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listings=await DataList.findById(id).populate("reviews");
    res.render("show",{listings});

})
)



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

app.use((err, req, res, next)=>{
  console.log("ERROR 👉", err);
  res.status(500).send(err.message);
})

app.use((err, req, res, next)=>{
  console.log("ERROR 👉", err);   // 👈 ADD THIS
  res.status(500).send("something was wrong");
})




//review section 

app.post("/listings/:id/reviews",async(req, res)=>{
  let listing=await DataList.findById(req.params.id);
  let newReview=new Review(req.body.review); 
  listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();
    console.log("new review saved");
  


    res.redirect(`/listings/${listing._id}`);
})


//delete review route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  
  let { id, reviewId } = req.params;

  await DataList.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  //  Review document delete
  await Review.findByIdAndDelete(reviewId);

  // Redirect
  res.redirect(`/listings/${id}`);
}));