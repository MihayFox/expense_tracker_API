const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // Reference to the Product model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
        required: true,
    },
    items: [orderItemSchema], // Array of sub-documents using the orderItemSchema
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order