const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { authRoutes } = require("./Routes/auth.js")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on https://localhost:${process.env.PORT}`)
    connectDB()
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("Database connected")
    } catch (e) {
        console.log(e)
    }
}