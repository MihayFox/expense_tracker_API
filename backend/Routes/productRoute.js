const express = require("express")
const { getProducts, addProducts, editProducts, deleteProduct } = require("../controllers/productController")

const router = express.Router()

router.get("/get", getProducts)
router.post("/add", addProducts)
router.put("/:id", editProducts)
router.delete("/:id", deleteProduct)

module.exports = router