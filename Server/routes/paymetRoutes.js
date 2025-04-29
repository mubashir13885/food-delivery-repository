const { paymentFunction } = require('../Controllers/paymentController')
const authMiddleware = require('../middleware/authMiddleware')

const paymentRouter = require('express').Router()


paymentRouter.post("/checkout",authMiddleware,paymentFunction)


module.exports=paymentRouter