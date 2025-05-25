
const { create, listItem, itemDetails, updateDetails, deleteItems } = require("../Controllers/itemContoller")
const authAdmin = require("../middleware/authAdmin")
const upload = require("../middleware/multer")

const itemRouter = require("express").Router()


itemRouter.post("/create",upload.single("image"),create)
itemRouter.get("/showitems",listItem)
itemRouter.get("/itemdetails/:itemId",itemDetails)
itemRouter.patch("/itemupdate/:itemId",upload.single("image"),updateDetails)
itemRouter.delete("/itemdelete/:itemId",deleteItems)





module.exports = itemRouter