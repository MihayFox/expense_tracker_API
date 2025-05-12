const express = require("express")
const { addUser, getUsers, deleteUser } = require("../controllers/usersController")

const router = express.Router()

router.post("/add", addUser)
router.get("/get", getUsers)
router.delete("/:id", deleteUser)

module.exports = router