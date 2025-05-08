const express = require("express")
const { addCategory, getCategories, editCategory, deleteCategory } = require("../controllers/categoryController")

const router = express.Router()

router.post("/add", addCategory)
router.get("/get", getCategories)
router.put("/:id", editCategory)
router.delete("/:id", deleteCategory)

module.exports = router