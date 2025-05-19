const Category = require("../models/Category")

const addCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body
        const query = {
            name: categoryName
        }
        const existingCategory = await Category.findOne(query)
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" })
        }

        const newCategory = new Category({
            name: categoryName,
            description: categoryDescription,
        })

        await newCategory.save()
        return res.status(201).json({ success: true, message: "Category added" })

    } catch (err) {
        console.log("Error adding category:", err)
        return res.status(500).json({ success: false, message: "Error adding category" })
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        return res.status(200).json({ success: true, categories })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const editCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { categoryName, categoryDescription } = req.body

        const existingCategory = await Category.findById(id)

        if (!existingCategory) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        if (existingCategory.name !== categoryName) {
            const categoryWithNewName = await Category.findOne({ name: categoryName })
            if (categoryWithNewName) {
                return res.status(400).json({ success: false, message: "Category name already exists" })
            }
        }

        existingCategory.name = categoryName
        existingCategory.description = categoryDescription

        await existingCategory.save()
        return res.status(200).json({ success: true, message: "Category edited" })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const existingCategory = await Category.findById(id)

        if (!existingCategory) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        await Category.findByIdAndDelete(id)
        return res.status(200).json({ success: true, message: "Category deleted" })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = { addCategory, getCategories, editCategory, deleteCategory }