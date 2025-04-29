const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true

    },

    items:[
        {
            itemId:{
            type: mongoose.Types.ObjectId,
            ref:"menu",
            required:true
            },
            price:{
             type:Number,
             required:true
            }
          }
    ],
    totalPrice:{
        type:Number,
        required:true,
        default:0
    }
})
cartSchema.methods.calculateTotalPrice = function (){
    this.totalPrice = this.items.reduce((total,item) => total + item.price,0)

}
module.exports = new mongoose.model('carts',cartSchema)