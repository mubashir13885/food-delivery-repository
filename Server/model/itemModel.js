const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
      default: true,
    },
   
  },
  { timestamps: true }
);

module.exports = new mongoose.model("menu",menuSchema)
