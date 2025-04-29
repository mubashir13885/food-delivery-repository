const itemModel = require("../model/itemModel");
const itemDb = require("../model/itemModel");
const restaurantModel = require("../model/restaurantModel");
const uploadToCloudinary = require("../utilities/imageUpload");


const create = async (req, res) => {
    try {
        console.log(req.body);
        const { item_name, description, price} = req.body

        if (!item_name || !description || !price) {
            return res.status(400).json({ error: "All fields are required" })
        }

      

        if (!req.file) {
            return res.status(400).json({ error: 'image not found' })
        }

        const cloudinaryRes = await uploadToCloudinary(req.file.path)

        const newItem = new itemDb({
            item_name, description, price , image: cloudinaryRes
        })

        let savedItem = await newItem.save()
        if (savedItem) {
            return res.status(200).json({ message: "Item added", savedItem })
        }

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })

    }
}

const listItem = async (req, res) => {
    try {
        const ItemList = await itemModel.find();

        res.status(200).json(ItemList)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}

 const itemDetails = async (req, res) => {
     try {
         const { itemId } = req.params;
 
         const itemDetails = await itemModel.findById(itemId)
         if (!itemDetails) {
             return res.status(400).json({ error: "Item not found" })
         }
         return res.status(200).json(itemDetails)
     } catch (error) {
         console.log(error);
         res.status(error.status || 500).json({ error: error.message || "internal server error" })
     }
 }
 const updateDetails = async (req, res) => {
     try {
         const { itemId } = req.params;
         const { item_name, description, price,restaurant} = req.body
         let imageUrl;
 
         let isItemExist = await itemModel.findById(itemId)
 
         if (!isItemExist) {
             return res.status(400).json({ error: "Item Not found" })
         }
         if (req.file) {
             const cloudinaryRes = await uploadToCloudinary(req.file.path)
             imageUrl = cloudinaryRes
         }
 
         const updatedDetails = await itemModel.findByIdAndUpdate(itemId, {item_name, description, price,restaurant, image: imageUrl }, { new: true })
         res.status(200).json({ messge: 'Item Updated', updatedDetails })
 
     } catch (error) {
         console.log(error);
         res.status(error.status || 500).json({ error: error.message || "internal server error" })
     }
 }
 const deleteItems = async (req, res) => {
     try {
         const { itemId } = req.params
         const deleteItem = await itemModel.findByIdAndDelete(itemId)
         if (!deleteItem) {
             return res.status(400).json({ error: "item Not found" })
         }
         res.status(200).json({ messsage: "Item deleted" })
     } catch (error) {
         console.log(error);
         res.status(error.status || 500).json({ error: error.message || "internal server error" })
     }
 }
 


module.exports = {
    create,
    listItem,
    itemDetails,
    updateDetails,
    deleteItems
}