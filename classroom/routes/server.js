const express = require("express");
const app = express();
const session = require('express-session');
const PORT = 3000;

app.use(session({secret:"mysupersecretstring",resave:false, saveUninitialized:true}));

app.get("/reqcount",(req, res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }

    res.send(`You are sent a request ${req.session.count} times`)
})




app.get("/", (req, res)=>{
    res.send("hello this is home page");
})

app.listen(PORT, (req,res)=>{
    console.log("server is running on port 3000")
})