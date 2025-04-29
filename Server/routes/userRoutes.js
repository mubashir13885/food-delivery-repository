const { register, login, userProfile, userUpdate, userLogout, userDelete } = require('../Controllers/userControllers')
const authMiddleware = require('../middleware/authMiddleware')

const userRouter = require('express').Router()

userRouter.post("/signup",register)
userRouter.post("/login",login)
userRouter.get("/profile",authMiddleware, userProfile)
userRouter.patch("/update/:userId",authMiddleware,userUpdate)
userRouter.post("/logout",userLogout) 
userRouter.delete("/delete",userDelete) 




module.exports = userRouter