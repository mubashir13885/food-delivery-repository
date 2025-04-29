const cartDb = require("../model/cartModel");
const itemDb = require("../model/itemModel");


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
        const userId = req.user
        const { itemId } = req.params

        const item = await itemDb.findById(itemId)

        if (!item) {
            return res.status(404).json({ error: "Item not found" })
        }

        let cart = await cartDb.findOne({ userId })

        if (!cart) {
            cart = new cartDb({ userId,items: [] })
        }

        const itemAlreadyExist = cart.items.some((items)=>items.itemId.equals(itemId))

        if (itemAlreadyExist) {
            return res.status(400).json({ error: "item already in cart" })

        }

        cart.items.push({
            itemId,
            price: item.price
        })

        cart.calculateTotalPrice()

        await cart.save()

        res.status(200).json({ message: "added to cart", cart })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })

    }
}


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
        const restaurantId = req.admin

        const cart = await cartDb.findOne({ userId , restaurantId })

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