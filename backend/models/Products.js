const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    name:
    {
        type: String,
        required: true,
    },
    description:
    {
        type: String,
        required: true,
    },
    price:
    {
        type: Number,
        required: true,
    },
    stock:
    {
        type: Number,
        required: true,
    },
    categoryID:
    {
        type: Schema.Types.ObjectId, ref: "categories",
        required: true,
    }
})

const name = "products"

module.exports = mongoose.models[name] || mongoose.model(name, productSchema)