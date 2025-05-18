const mongoose = require('mongoose')
require('dotenv').config()

const Category = require('./models/Category')
const Product = require('./models/Products')
const Order = require('./models/Order')
const User = require('./models/User')

// Static data - AI generated
const staticCategories = [
    { name: 'Electronics', description: 'Gadgets and devices for modern living' },
    { name: 'Books', description: 'A wide range of fiction and non-fiction books' },
    { name: 'Apparel', description: 'Fashionable clothing and accessories for all' },
    { name: 'Home & Kitchen', description: 'Essential items for creating a comfortable home' },
    { name: 'Sports', description: 'Equipment and gear for various sports and activities' },
    { name: 'Beauty', description: 'Cosmetics and personal care products' },
    { name: 'Toys', description: 'Fun and educational toys for children' },
]

const staticProducts = [
    { name: 'Laptop Pro', description: 'High-performance laptop', price: 1499.99, stock: 30, categoryName: 'Electronics' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 25.00, stock: 150, categoryName: 'Electronics' },
    { name: 'E-Reader', description: 'Digital book reader', price: 99.00, stock: 80, categoryName: 'Electronics' },
    { name: 'Mystery Novel', description: 'Gripping whodunit story', price: 12.50, stock: 250, categoryName: 'Books' },
    { name: 'Cookbook: Italian', description: 'Master home cooking', price: 20.00, stock: 100, categoryName: 'Books' },
    { name: 'Fantasy Epic', description: 'Dragons and magic', price: 18.00, stock: 180, categoryName: 'Books' },
    { name: 'Cotton T-Shirt', description: 'Basic crew neck t-shirt', price: 15.00, stock: 400, categoryName: 'Apparel' },
    { name: 'Denim Jeans', description: 'Classic blue jeans', price: 45.00, stock: 100, categoryName: 'Apparel' },
    { name: 'Summer Dress', description: 'Light and airy dress', price: 35.00, stock: 120, categoryName: 'Apparel' },
    { name: 'Blender', description: 'Smoothie maker', price: 55.00, stock: 70, categoryName: 'Home & Kitchen' },
    { name: 'Toaster Oven', description: 'Compact baking oven', price: 70.00, stock: 60, categoryName: 'Home & Kitchen' },
    { name: 'Coffee Mug Set (4)', description: 'Ceramic mugs', price: 22.00, stock: 150, categoryName: 'Home & Kitchen' },
    { name: 'Yoga Mat Standard', description: 'Durable yoga mat', price: 28.00, stock: 130, categoryName: 'Sports' },
    { name: 'Basketball', description: 'Indoor/outdoor basketball', price: 20.00, stock: 90, categoryName: 'Sports' },
    { name: 'Resistance Bands Set', description: 'Workout bands', price: 19.00, stock: 180, categoryName: 'Sports' },
    { name: 'Face Moisturizer', description: 'Hydrating cream', price: 30.00, stock: 200, categoryName: 'Beauty' },
    { name: 'Lipstick Set', description: 'Variety of colors', price: 25.00, stock: 150, categoryName: 'Beauty' },
    { name: 'Building Blocks (500)', description: 'Creative building toy', price: 40.00, stock: 100, categoryName: 'Toys' },
    { name: 'Action Figure', description: 'Collectible hero figure', price: 15.00, stock: 200, categoryName: 'Toys' },
]

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log('Database connected')
    } catch (e) {
        console.error('Connect failed', e.message)
    }
}

const generateOrders = (count, user, products) => {
    const orders = [] // array of orders that will be returned
    const today = new Date()
    const startDate = new Date()
    let nrOfMonths = 48 // the range of months to generate data
    startDate.setMonth(today.getMonth() - nrOfMonths)

    for (let i = 0; i < count; i++) {
        const orderUser = user
        let productsRange = 4
        const nrOfProducts = Math.floor(Math.random() * productsRange) + 1 // random nr between 1 - productsRange
        const orderItems = []
        let totalAmount = 0

        const productsToPick = Math.min(nrOfProducts, products.length)

        while (orderItems.length < productsToPick) {
            const randomProduct = products[Math.floor(Math.random() * products.length)] // choose a random product from the products DB

            let quantityRange = 3
            const productQuanity = Math.floor(Math.random() * quantityRange) + 1 // random nr between 1 - quantityRange
            const productPrice = randomProduct.price

            orderItems.push({
                product: randomProduct._id,
                name: randomProduct.name,
                quantity: productQuanity,
                price: productPrice,
            })
            totalAmount += productPrice * productQuanity
        }

        const randomDate = new Date(startDate.getTime() + Math.random() * (today.getTime() - startDate.getTime()))

        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Delivered', 'Processing']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        orders.push({
            user: orderUser._id,
            items: orderItems,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            status: randomStatus,
            orderDate: randomDate,
        })
    }
    return orders
}

const importData = async () => {
    try {
        await connectDB()

        // Cache the user
        const user = await User.findOne({ email: "test@test.com" })

        // Insert categories
        const createdCategories = await Category.insertMany(staticCategories)

        // Map the products and return their data (name, description, price, stock, categoryID)
        const productsWithCategoryIds = staticProducts.map(product => {
            // Find the category corresponding to the product category, we need it to add it's ID in the DB
            const category = createdCategories.find(cat => cat.name === product.categoryName)
            return {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                categoryID: category._id,
            }
        })

        // Add the products in the DB and cache them
        const createdProducts = await Product.insertMany(productsWithCategoryIds)

        let nrOfOrders = 1000 // nr of orders to generate
        const generatedOrders = generateOrders(nrOfOrders, user, createdProducts)
        await Order.insertMany(generatedOrders)

        console.log('Data imported!')
        process.exit(0)

    } catch (error) {
        console.error('Error during data import', error)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await connectDB()

        await Order.deleteMany()
        await Product.deleteMany()
        await Category.deleteMany()

        console.log('Data destroyed!')
        process.exit(0)

    } catch (error) {
        console.error('Error destroying data', error)
        process.exit(1)
    }
}

if (process.argv[2] === 'import') {
    importData()
} else if (process.argv[2] === 'destroy') {
    destroyData()
}