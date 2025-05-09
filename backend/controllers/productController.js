const Category = require("../models/Category")
const Products = require("../models/Products")

const addProducts = async (req, res) => {
    try {
        const { name, description, price, stock, categoryID } = req.body

        const newProduct = new Products({
            name: name,
            description: description,
            price: price,
            stock: stock,
            categoryID: categoryID,
        })

        await newProduct.save()
        return res.status(201).json({ success: true, message: "Product added" })

    } catch (err) {
        console.log("Error adding product:", err);
        return res.status(500).json({ success: false, message: "Error adding Product" })
    }
}

const editProducts = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, stock, categoryID } = req.body

        const updatedProduct = await Products.findByIdAndUpdate(id, {
            name: name,
            description: description,
            price: price,
            stock: stock,
            categoryID: categoryID,
        })

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        return res.status(200).json({ success: true, message: "Product edited", product: updatedProduct })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Products.find().populate("categoryID")
        const categories = await Category.find()
        return res.status(200).json({ success: true, products, categories })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await Products.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        return res.status(200).json({ success: true, message: "Product deleted" })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" })
    }
}

module.exports = { getProducts, addProducts, editProducts, deleteProduct }