const express = require("express");


const authMiddleware = require("../middleware/authMiddleware");
const { createOrderFromCart, listOrders, updateOrderStatus } = require("../Controllers/ordercontroller");

const ordeRouter = express.Router();

ordeRouter.post("/place-order", authMiddleware, createOrderFromCart);
ordeRouter.get("/orders",listOrders);
ordeRouter.patch("/update-status/:orderId", updateOrderStatus);

module.exports = ordeRouter;
