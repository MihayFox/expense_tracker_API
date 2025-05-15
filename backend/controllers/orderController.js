const Order = require('../models/Order')
const Product = require('../models/Products')
const User = require('../models/User')
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId

const createOrder = async (req, res) => {
    const { userId, items } = req.body

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'User ID and order items are required' })
    }

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        let totalAmount = 0
        const orderItems = []

        for (const item of items) {
            const product = await Product.findById(item.productId)

            if (!product) {
                return res.status(400).json({ success: false, message: `Product with ID ${item.productId} not found` })
            }

             if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
                return res.status(400).json({ success: false, message: `Quantity for product ${product.name} must be a positive integer` })
            }

            const itemPrice = product.price
            const subtotal = itemPrice * item.quantity

            orderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: itemPrice,
            })

            totalAmount += subtotal
        }

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount: totalAmount,
        })

        const createdOrder = await order.save()

        res.status(201).json({ success: true, message: 'Order created successfully', order: createdOrder })

    } catch (error) {
        console.error("createOrder: Server Error:", error);
        res.status(500).json({ success: false, message: 'Server error creating order' })
    }
}

const getOrdersAdmin = async (req, res) => {
    try {
        // Populate user details (name and email) and items (product name and imageUrl if needed, but model only has name/quantity/price)
        const orders = await Order.find({}).populate('user', 'name email') // Populating user
        // If you want details about the items themselves, you might need to populate items.product,
        // but the order item subdocument already stores name and price, which is often enough for display.
        // Example to populate product details within items (adjust fields as needed):
        // const orders = await Order.find({}).populate('user', 'name email').populate('items.product', 'name imageUrl');


        res.status(200).json({ success: true, count: orders.length, orders })

    } catch (error) {
        console.error("getOrdersAdmin: Server Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching orders' })
    }
}

const getOrdersUser = async (req, res) => {
    const userId = req.params.userId

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) { // Use mongoose.Types.ObjectId.isValid
         return res.status(400).json({ success: false, message: 'Invalid user ID format' })
    }


    try {
        const orders = await Order.find({ user: userId }).populate('items.product', 'name imageUrl')

        res.status(200).json({ success: true, count: orders.length, orders })


    } catch (error) {
        console.error("getOrdersUser: Server Error:", error)
        // CastError is handled by isValid check now, but good to keep defensive
        if (error.name === 'CastError') {
             return res.status(400).json({ success: false, message: 'Invalid user ID' })
        }
        res.status(500).json({ success: false, message: 'Server error fetching user orders' })
    }
}

// NEW FUNCTION to update order status
const updateOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body; // Get the new status from the request body

    // Basic validation
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID format' });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // Validate if the provided status is one of the allowed enum values
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}` });
    }

    try {
        // Find the order by ID and update its status
        // { new: true } option returns the updated document
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true }
        ).populate('user', 'name email'); // Populate user again for the response if needed by frontend

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order status updated successfully', order: updatedOrder });

    } catch (error) {
        console.error("updateOrderStatus: Server Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating order status' });
    }
};


module.exports = { createOrder, getOrdersAdmin, getOrdersUser, updateOrderStatus }