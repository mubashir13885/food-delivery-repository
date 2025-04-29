const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type : String,
        min:3,
        max:10,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    
    password:{
        type:String,
        reqired:true
    },
    profilrpic:{
         type:String,
         default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    phoneNumber:{
        type:Number,
        required:true
        
    }
},{timestamps:true})

 const userModel = new mongoose.model("User",userSchema)
 module.exports = userModel

