const jwt = require("jsonwebtoken")
const User = requrie("../models/User.js")
require("dotenv").config()

const login = async(req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({success: false, message: "User not found"})
        }
        let isMatch
        if (password === user.password) {
            isMatch = true
        } else {
            isMatch = false
        }
        if (!isMatch) {
            return res.status(401).json({success: false, message: "Invalid password"})
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"})
        return res.status(200).json({succes: true, message: "Login successful", token, user: {id: user._id, name: user.name, email: user.email, role: user.role}})
    } catch (e) {
        return res.status(500).json({success: false, message: "Backend error"})
    }
}

export {login}