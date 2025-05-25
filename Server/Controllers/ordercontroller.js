const cartDb = require("../model/cartModel");
const orderDb = require("../model/orderModel");

const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user;

    const cart = await cartDb.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const newOrder = new orderDb({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
    });

    await newOrder.save();

    // Optionally clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderDb.find()
      .populate('items.itemId')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error listing orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status by ID
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedOrder = await orderDb.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {
  createOrderFromCart,
  listOrders,
  updateOrderStatus
};
