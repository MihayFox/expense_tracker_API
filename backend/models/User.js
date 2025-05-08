const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name:
    {
        type: String,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true,
    },
    role:
    {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

const name = "users"

module.exports = mongoose.models[name] || mongoose.model(name, userSchema)