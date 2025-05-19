const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./Routes/auth.js')
const categoryRoutes = require("./Routes/categoryRoute.js")
const productRoutes = require('./Routes/productRoute.js')
const usersRoutes = require('./Routes/usersRoute.js')
const orderRoutes = require('./routes/orderRoute.js')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/orders', orderRoutes)

app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("Database connected")
    } catch (e) {
        console.log("Connect failed", e.message)
    }
}