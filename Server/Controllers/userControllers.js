const userModel = require("../model/userModel")
const bcrypt = require('bcrypt')
const generateToken = require("../utilities/generateToken")


const  register = async (req,res)=>{
     try {
    
        
        const {name,email,password,phoneNumber} = req.body
         if(!name || !email || !password || !phoneNumber){

            return res.status(400).json({error:"All feilds are required"})
         }
           const salt = await bcrypt.genSalt(10)
           const hashedPAssword = await bcrypt.hash(password,salt)



         const newUser = new userModel({name,email,password:hashedPAssword,phoneNumber})
        const savedUser = await newUser.save()
        const token = generateToken(savedUser._id)
        res.cookie("token",token)
         res.status(201).json({message:"Registration successfull",savedUser})
         
     } catch (error) {
        console.log(error);
        if(error.code == 11000){
            return res.status(400).json({error:"Email Already exist"})
        }
        res.status(error.status || 500).json({error:error.message || "internel server error"})
        
    }

     
}

const login = async (req,res)=>{
    try {
        const {role}=req.query
        console.log(role,"role");
        
        const {email,password,} = req.body
        if(!email || !password){
            return res.status(400).json("All feilds are required")
        }
        const existUser = await userModel.findOne({email , role})
        if(!existUser){
            return res.status(400).json("user does not exist")
        }
       const passwordMatch = await bcrypt.compare(password,existUser.password)
       console.log(passwordMatch,"passwordMatch");

       if(!passwordMatch){
        return res.status(400).json("password does not match")
    }
    const userObject = existUser.toObject()
    delete userObject.password

    const token = generateToken(existUser._id)

    return res.status(201).json({message:"login successfill",userObject,token})
   
    
    } catch (error) {
        console.log(error);
         res.status(error.status || 500).json({error: error.message || "internel server error"})
    }
}
const userProfile = async (req,res)=>{
    try {
       
        const userId=req.user;
        const userDetails = await userModel.findById(userId).select("-password")
        res.status(200).json(userDetails)
    } catch (error) {
        console.log(error);
        
        res.status(error.status || 500).json({error:error.message || "internel server error"})
    }
}

const userUpdate = async (req,res)=>{
    try {
        const {userId} = req.params
        console.log(req.body);
        const updatedUser = await userModel.findByIdAndUpdate(userId,req.body,{new:true})
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error);
        
        res.status(error.status || 500).json({error:error.message || "internel server error"})
    }
}
const userDelete = async (req,res)=>{
    try {
        const {userId} = req.params
        await userModel.findByIdAndDelete(userId)
        res.status(200).json("user Deleted")
    } catch (error) {
        console.log(error);
        
        res.status(error.status || 500).json({error:error.message || "internel server error"})
    }
}

const userLogout = (req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({message:"User Logedout"})
    } catch (error) {
        console.log(error);
        
    }
}



module.exports={
    register,
    login,
    userProfile,
    userUpdate,
    userLogout,
    userDelete
}






