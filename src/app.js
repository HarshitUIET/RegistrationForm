require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
require("../connection/conn");
const Register = require("../models/model");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 8000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");

app.use(express.static(staticPath));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "hbs")
app.set("views", templatePath)

app.get("/", (req, res) => {
    res.render("Home");
})

app.get("/register", (req, res) => {
    res.render("registerPage");
})

app.get("/secret",auth,(req,res)=>{
    res.render("secret");
})

app.get("/login",(req,res)=>{
    res.render("login");
    // console.log(req.cookies.jwt);
})

app.get("/logout",auth, async (req,res)=>{
    try{
        //  console.log(req.user);
        //  console.log(req.user.tokens);

        // for single logout
        // req.user.tokens = req.user.tokens.filter((ele)=>{
        //     return  ele.token !== req.token;
        // })

        // for logout from all devices
        req.user.tokens = [];

        console.log("logout successfully");
        res.clearCookie("jwt");
        await req.user.save();
        res.redirect("/");
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

// console.log(process.env.SECRET_KEY);

app.post("/login", async (req,res)=>{

      try{
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const registerInfo = await Register.findOne({email:userEmail});
        

        //   console.log(registerInfo.password);
         const checkHashPassword = await bcrypt.compare(userPassword,registerInfo.password);
        //  console.log(checkHashPassword);
         const token = await registerInfo.createToken();  
         console.log(token);

         res.cookie("jwt",token,{
            expires: new Date(Date.now() + 60000),
             httpOnly:true
         });

        if(checkHashPassword) {
            res.render("afterlogin");
        }else{
            res.send("Check your email id and Password");
        }
      }catch(e){
           res.status(400).send("Invalid identity");
      }

 
})

app.post("/register", async (req, res) => {


   try {


        const password = req.body.password;
        const cpassword = req.body.cpassword;

   const hashPassword = await bcrypt.hash(password,10);
          const hashcPassword = await bcrypt.hash(cpassword,10);

        if (password === cpassword) {
            const registerdata = new Register({
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                gender: req.body.gender,
                contact: req.body.contact,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword
            })
                console.log("using middleware");
                 const token = await registerdata.createToken();  
                 console.log(token);

                 

            const registered = await registerdata.save();
            res.status(200).render("Home");
        } else {
            res.status(400).send("Password Not Matching");
        }
    } catch (err) {
        res.status(400).send(err);
    }



})


// const securePassword = async (password) => {

//      try{
//         const hashPassword = await bcrypt.hash(password,10);
//         console.log(hashPassword);
//         const check = await bcrypt.compare(password,hashPassword);
//         console.log(check);
//      }catch(err){
//         console.log(err);
//      }

   
// }

// securePassword("harshit");

// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//     const token = await jwt.sign({_id:"64d3d5b86423ea9c7ab78bad"},"mynameisharshitpachauri",{
//         expiresIn : "2 seconds"
//     });
//     console.log(token);
//     const userVer = await jwt.verify(token,"mynameisharshitpachauri");
//     console.log(userVer);
// }

// createToken();

app.listen(port, () => {
    console.log(`listening to the port no ${port}`)
})