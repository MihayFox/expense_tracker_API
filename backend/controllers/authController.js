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
        return res.status(500).json({ success: false, message: "Backend error" })
    }
}

const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password,
            role: 'user',
        });

        await newUser.save();

        return res.status(201).json({ success: true, message: "User registered successfully" })

    } catch (e) {
        console.error("Signup error:", e);
        return res.status(500).json({ success: false, message: "Backend error during signup" })
    }
};

module.exports = { login, signup }