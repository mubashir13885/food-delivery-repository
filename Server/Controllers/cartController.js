const cartDb = require("../model/cartModel");
const itemDb = require("../model/itemModel");
const orderDb = require("../model/orderModel");


const getCart = async (req, res) => {
    try {
        const userId = req.user

        const cart = await cartDb.findOne({ userId }).populate("items.itemId")
        console.log(cart);

        if (!cart) {
            return res.status(400).json({ error: 'cart is empty' })
        }

        res.status(200).json(cart)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}



const addTocart = async (req, res) => {
  try {
    const userId = req.user;
    const { itemId } = req.params;

    const item = await itemDb.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    let cart = await cartDb.findOne({ userId });
    if (!cart) {
      cart = new cartDb({ userId, items: [] });
    }

    const alreadyExists = cart.items.some((i) => i.itemId.equals(itemId));
    if (alreadyExists) {
      return res.status(400).json({ error: "Item already in cart" });
    }

    cart.items.push({ itemId, price: item.price });
    cart.calculateTotalPrice();
    await cart.save();

    // 🔥 Save to Order collection as a pending order (if not already there)
    let existingOrder = await orderDb.findOne({ userId, status: 'pending' });

    if (!existingOrder) {
      // Create a new order
      existingOrder = new orderDb({
        userId,
        items: [{ itemId, price: item.price }],
        totalPrice: item.price,
        status: 'pending',
      });
    } else {
      // Update existing pending order
      existingOrder.items.push({ itemId, price: item.price });
      existingOrder.totalPrice += item.price;
    }

    await existingOrder.save();

    res.status(200).json({ message: "Item added to cart and order saved", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const removeFromCart = async (req, res) => {
    try {

        const userId = req.user;
        const { itemId } = req.params

        let cart = await cartDb.findOne({ userId})
        if (!cart) {
            return res.status(404).json({ error: "cart not found" })
        }

        cart.items = cart.items.filter((item) =>!item.itemId.equals(itemId))

        cart.calculateTotalPrice();

        await cart.save()

        res.status(200).json({ message: 'item removed from cart', cart })


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const clearCart = async (req, res) => {
    try {
        const userId = req.user;
       

        const cart = await cartDb.findOne({ userId})

        if (!cart) {
            return res.status(404).json({ error: "cart not found" })
        }

        cart.menu = []

        await cart.save()
        return res.status(200).json({ message: 'cart cleared' })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }

}

module.exports = {
    addTocart,
    getCart,
    removeFromCart,
    clearCart
}