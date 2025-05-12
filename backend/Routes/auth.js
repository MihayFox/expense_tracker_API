const express = require("express")
const { login, signup, updateUser } = require("../controllers/authController.js")
const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.put("/update", updateUser)

module.exports = router