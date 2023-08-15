const mongoose = require("mongoose");


mongoose.connect("mongodb://0.0.0.0:27017/registerInfo",{})
.then(()=>{
    console.log("Connection Successfull");
}).catch((e)=>{
      console.log(e);
})   