const mongoose = require("mongoose")
require("dotenv").config()

const userSchema = new mongoose.Schema({
    name: {Type: String},
    email: {Type: String, required: true, unique: true},
    password: {Type: String, required: true},
    role: {Type: String, enum:["admin", "user"], default: "user"}
})

const User = mongoose.model("User", userSchema)

export default User