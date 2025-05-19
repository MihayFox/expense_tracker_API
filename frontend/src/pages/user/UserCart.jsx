import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate, NavLink } from 'react-router-dom'
import { CartContext } from '../../context/cartContext'
import { useAuth } from '../../context/authContext'

const UserCart = () => {
    const {
        cartItems,
        removeItem,
        updateItemQuantity,
        getTotalPrice,
        clearCart,
    } = useContext(CartContext)

    const { user } = useAuth()
    const userId = user?.id


    const navigate = useNavigate()
    const [orderError, setOrderError] = useState(null)
    const [orderSuccess, setOrderSuccess] = useState(false)

    const handlePlaceOrder = async () => {
        setOrderError(null)
        setOrderSuccess(false)

        try {
            const orderData = {
                userId: userId,
                items: cartItems.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                })),
            }

            const response = await axios.post(
                "http://localhost:3000/api/orders/",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

            if (response.data.success) {
                setOrderSuccess(true)
                clearCart()

                alert('Order placed successfully!')
                navigate('/user/orders')

            } else {
                setOrderError(response.data.message || 'Failed to place order')
            }

        } catch (err) {
            console.error("Error placing order:", err)
            setOrderError('Failed to place order. Please try again.')
            if (err.response && err.response.data && err.response.data.message) {
                setOrderError(err.response.data.message)
            } else if (err.request) {
                setOrderError('Network error. Please check your connection.')
            } else {
                setOrderError('An unexpected error occurred.')
            }
        }
    }

    const cartTotal = getTotalPrice()

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <div>Your cart is empty. <NavLink to="/user/products" className="text-blue-600 hover:underline">Go add some products!</NavLink></div>
            ) : (
                <div>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex items-center border-b pb-4">
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                    <p className="text-gray-600 text-sm">${item.product.price.toFixed(2)} each</p>
                                </div>

                                <div className="flex items-center mx-4">
                                    <button
                                        onClick={() => updateItemQuantity(item.product._id, item.quantity - 1)}
                                        className="cursor-pointer bg-gray-300 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-400"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItemQuantity(item.product._id, parseInt(e.target.value))}
                                        className="w-12 text-center border-t border-b py-1"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => updateItemQuantity(item.product._id, item.quantity + 1)}
                                        className="cursor-pointer bg-gray-300 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-400"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="font-semibold mr-4">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </div>

                                <button
                                    onClick={() => removeItem(item.product._id)}
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-right">
                        <h3 className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</h3>
                    </div>

                    <div className="mt-6 text-right">
                        {orderError && <p className="text-red-500 mb-2">{orderError}</p>}
                        {orderSuccess && <p className="text-green-500 mb-2">Order placed!</p>}

                        <button
                            onClick={handlePlaceOrder}
                            className="cursor-pointer bg-green-500 text-white py-2 px-6 rounded-lg text-lg font-semibold"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserCart