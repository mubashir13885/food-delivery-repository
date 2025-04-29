const restaurantModel = require("../model/restaurantModel");
const RestaurantDb = require("../model/restaurantModel");
const uploadToCloudinary = require("../utilities/imageUpload");

const create = async (req, res) => {
    try {
        console.log(req.body);
        const { name, location, contact, rating , operating_hours } = req.body

        if (!name || !location || !contact || !rating || !operating_hours) {
            return res.status(400).json({ error: "All fields are required" })
        }
        if (!req.file) {
            return res.status(400).json({ error: 'image not found' })
        }

        const cloudinaryRes = await uploadToCloudinary(req.file.path)

        const newRes = new RestaurantDb({
            name, location, contact, rating,operating_hours, image: cloudinaryRes
        })

        let savedRes = await newRes.save()
        if (savedRes) {
            return res.status(200).json({ message: "Restaurant added", savedRes })
        }

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })

    }
}

const listRestaurant = async (req, res) => {
    try {
        const restautantList = await restaurantModel.find();

        res.status(200).json(restautantList)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}
const restaurantDetails = async (req, res) => {
    try {
        const {_id} = req.params;

        const restoDetails = await restaurantModel.findOne(_id)
        if (!restoDetails) {
            return res.status(400).json({ error: "Restaurant not found" })
        }
        return res.status(200).json(restoDetails)
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}
const updateDetails = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { name, location, contact, rating , operating_hours} = req.body
        let imageUrl;

        let isRestoExist = await restaurantModel.findById(restaurantId)

        if (!isRestoExist) {
            return res.status(400).json({ error: "Restaurant Not found" })
        }
        if (req.file) {
            const cloudinaryRes = await uploadToCloudinary(req.file.path)
            imageUrl = cloudinaryRes
        }

        const updatedDetails = await restaurantModel.findByIdAndUpdate(restaurantId, { name, location, contact, rating , operating_hours, image: imageUrl }, { new: true })
        res.status(200).json({ messge: 'Reataurant Updated', updatedDetails })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}
const deleteRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params
        const deleteResto = await restaurantModel.findByIdAndDelete(restaurantId)
        if (!deleteResto) {
            return res.status(400).json({ error: "Restaurant Not found" })
        }
        res.status(200).json({ messsage: "Restaurant deleted" })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "internal server error" })
    }
}



module.exports={
    create,
    listRestaurant,
    restaurantDetails,
    updateDetails,
    deleteRestaurant
}