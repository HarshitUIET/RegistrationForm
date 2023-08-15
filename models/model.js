const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
     firstname : {
        type : String,
        require : true
     },
     lastname : {
        type : String,
        require : true
     },
     gender: {
        type : String,
        require : true
     },
     contact : {
        type : Number,
        require : true
     },
     email : {
        type : String,
        require : true
     },
     password : {
        type : String,
        require : true
     },
     cpassword: {
        type : String,
        require : true
     },
     tokens:[{
        token:{
            type:String,
            require:true
        }
     }]

})

registerSchema.methods.createToken = async function() {

   try{
    const token = await jwt.sign({_id:this._id},process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;

   }catch(err){
       res.send(err);
   }
      
} 

registerSchema.pre("save",async function(next){
      if(this.isModified("password")) {
         console.log(this.password);
         this.password = await bcrypt.hash(this.password,10);
         console.log(this.password);
         this.cpassword = undefined;
      }
        next();
})

const Register = mongoose.model("Register",registerSchema);

module.exports = Register;