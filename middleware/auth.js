const jwt = require("jsonwebtoken");
const Register = require("../models/model");

const auth = async (req,res,next) =>{
     
      try{
         console.log("Inside auth");
        const token = req.cookies.jwt;
        //  console.log(token);
           const userVer =  jwt.verify(token,process.env.SECRET_KEY);
        //    console.log(userVer);
           const user = await Register.findOne({_id:userVer._id});
        //    console.log(user);
           req.token = token;
           req.user = user;
         next();
      }catch(err){
        res.status(401).send(err);
      }

    
}

module.exports = auth;