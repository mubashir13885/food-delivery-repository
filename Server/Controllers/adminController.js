const adminModel = require("../model/adminModel");
const generateAdminToken = require("../utilities/generateAdminToken");

const bcrypt = require('bcrypt')



const  register = async (req,res)=>{
    try {
   
       
       const {email,password} = req.body
        if(!email || !password){

           return res.status(400).json({error:"All feilds are required"})
        }
          const salt = await bcrypt.genSalt(10)
          const hashedPAssword = await bcrypt.hash(password,salt)



        const newadmin = new adminModel({email,password:hashedPAssword})
       const savedAdmin= await newadmin.save()
       const Admin_token = generateAdminToken(savedAdmin._id)
       res.cookie("Admin_token",Admin_token)
        res.status(201).json({message:"Registration successfull",savedAdmin})
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
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json("All feilds are required")
        }
        const userExist = await adminModel.findOne({email})
        if(!userExist){
            return res.status(400).json("user does not exist")
        }
       const passwordMatch = await bcrypt.compare(password,userExist.password)
       console.log(passwordMatch,"passwordMatch");

       if(!passwordMatch){
        return res.status(400).json("password does not match")
    }
    const Admin_token = generateAdminToken(userExist._id)

    res.cookie("Admin_token",Admin_token)

    res.status(201).json({message:"login successfill"})
    } catch (error) {
        console.log(error);
         res.status(error.status || 500).json({error: error.message || "internel server error"})
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("Admin_token")
        res.status(200).json({ message: "logout succesfull" })
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

module.exports = {
    register,
    login,
    logout
}