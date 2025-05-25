const { create, listRestaurant, restaurantDetails, updateDetails, deleteRestaurant } = require('../Controllers/restaurantController')
const authAdmin = require('../middleware/authAdmin')
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')

const restoRoter = require('express').Router()


restoRoter.post("/create",upload.single("image"),create)
restoRoter.get("/showrestaurants",listRestaurant)
restoRoter.get("/restodetails/:restaurantId",restaurantDetails)
restoRoter.patch("/update/:restaurantId",upload.single("image"),updateDetails)
restoRoter.delete("/delete/:restaurantId",deleteRestaurant)


module.exports = restoRoter