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
        console.log("Error adding category:", err);
        return res.status(500).json({ success: false, message: "Error adding category" })
    }
}

module.exports = { addCategory }