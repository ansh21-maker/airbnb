const mongoose=require("mongoose");


const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        url: String,
       filename: String
    },
    description:String,
    price:Number,
    location:String,
    country:String,
})


const DataList=mongoose.model("DataList",listingSchema);

module.exports=DataList;