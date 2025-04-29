const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
    console.log("DB connection seccessfull");
    } catch (error) {
        console.log(error);
        
    }
    
}

module.exports ={ connectDb }