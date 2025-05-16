const User = require("../models/User")

const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "Please provide name, email, password, and role" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" })
        }

        const newUser = new User({
            name,
            email,
            password: password,
            role: role || 'user',
        })

        await newUser.save()

        const userResponse = newUser.toObject()
        delete userResponse.password

        return res.status(201).json({ success: true, message: "User added successfully", user: userResponse })

    } catch (err) {
        console.error("Error adding user:", err)
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message)
            return res.status(400).json({ success: false, message: messages.join(', ') })
        }
        return res.status(500).json({ success: false, message: "Error adding user" })
    }
}

const getUsers = async (req, res) => {
    try {

        const users = await User.find()

        return res.status(200).json({ success: true, count: users.length, users })

    } catch (err) {
        console.error("Error getting users:", err)
        return res.status(500).json({ success: false, message: "Server error fetching users" })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        // Find and delete the user
        const user = await User.findByIdAndDelete(id)

        // Check if the user was found and deleted
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({ success: true, message: "User deleted successfully" })

    } catch (err) {
        console.error("Error deleting user:", err)
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid user ID" })
        }
        return res.status(500).json({ success: false, message: "Server error deleting user" })
    }
}

module.exports = { addUser, getUsers, deleteUser }