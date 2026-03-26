const mongoose=require("mongoose");


const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
         title: String,        
        imageUrl: String 

    },
    price:{
        type:Number,
         required:true
    },
    location:{
        type:String,
         required:true
    },  
    country:{
        type:String,
         required:true
    },
})


const DataList=mongoose.model("DataList",listingSchema);

module.exports=DataList;