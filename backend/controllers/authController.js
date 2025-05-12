const jwt = require("jsonwebtoken")
const User = require("../models/User.js")
require('dotenv').config()

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }
        let isMatch
        if (password === user.password) {
            isMatch = true
        } else {
            isMatch = false
        }
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" })
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return res.status(200).json({ success: true, message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
    } catch (e) {
        console.error("Login error:", e)
        return res.status(500).json({ success: false, message: "Backend error during login" })
    }
}

const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" })
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password,
            role: 'user',
        })

        await newUser.save()

        return res.status(201).json({ success: true, message: "User registered successfully" })

    } catch (e) {
        console.error("Signup error:", e)
        return res.status(500).json({ success: false, message: "Backend error during signup" })
    }
}

const updateUser = async (req, res) => {
    try {
        const { currentEmail, currentPassword, name, email, password } = req.body

        if (!currentEmail || !currentPassword) {
             return res.status(400).json({ success: false, message: "Current email and password are required to update settings." })
        }
        const user = await User.findOne({ email: currentEmail })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with provided email." })
        }
        if (currentPassword !== user.password) {
             return res.status(401).json({ success: false, message: "Invalid current password." })
        }
        if (name !== undefined && name !== user.name) {
            user.name = name
        }
        if (email !== undefined && email !== user.email) {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ success: false, message: "New email already in use." })
            }
            user.email = email
        }
        if (password !== undefined && password !== '') {
            user.password = password
        }
        if (user.isModified()) {
             await user.save()
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })

    } catch (e) {
        console.error("Update user error:", e)
        return res.status(500).json({ success: false, message: "Backend error during update." })
    }
}


module.exports = { login, signup, updateUser }