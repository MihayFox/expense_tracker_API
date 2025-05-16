const express = require('express')
const { createOrder, getOrdersAdmin, getOrdersUser, updateOrderStatus } = require('../controllers/orderController')

const router = express.Router()

router.post('/', createOrder)
router.get('/admin', getOrdersAdmin)
router.get('/user/:userId', getOrdersUser)
router.patch('/:orderId', updateOrderStatus)

module.exports = router