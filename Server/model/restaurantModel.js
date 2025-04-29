const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    operating_hours: {
      type: String,
      required: true,
    },
    image:{
        type:String,
        required:true
    }
   
  },
  { timestamps: true }
);

module.exports = new mongoose.model("restaurants",restaurantSchema)
