const { addTocart, getCart, removeFromCart, clearCart } = require('../Controllers/cartController')
const authAdmin = require('../middleware/authAdmin')
const authMiddleware = require('../middleware/authMiddleware')

const cartRouter = require('express').Router()


cartRouter.post("/addtocart/:itemId", authMiddleware, addTocart)
cartRouter.get("/getcart", authMiddleware, getCart)
cartRouter.delete("/removefromcart/:itemId", authMiddleware, removeFromCart)
cartRouter.post("/clearcart", authMiddleware, clearCart)






module.exports=cartRouter