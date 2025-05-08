const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema({
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
})

const name = "categories"

module.exports = mongoose.models[name] || mongoose.model(name, categorySchema)