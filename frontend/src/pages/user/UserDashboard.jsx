import React, { useEffect, useState, useContext } from 'react'
import { useAuth } from '../../context/authContext'
import { CartContext } from '../../context/cartContext'
import axios from 'axios'

function UserDashboard() {
    const { user } = useAuth()
    const { addItem } = useContext(CartContext)

    const [orders, setOrders] = useState(null)
    const [frequentlyPurchased, setFrequentlyPurchased] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setError(null)
                const response = await axios.get(`http://localhost:3000/api/orders/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (response.data.success) {
                    setOrders(response.data.orders)
                } else {
                    setError(response.data.message || 'Failed to fetch your orders')
                }

            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch your orders. Please try again.')
            }
        }

        fetchUserOrders()
    }, [user.id])

    useEffect(() => {
        if (orders && orders.length > 0) {
            const productCounts = {}

            orders.forEach(order => {
                order.items.forEach(item => {
                    if (item.product && item.product._id) {
                        const productId = item.product._id
                        const productDetails = item.product

                        if (productCounts[productId]) {
                            productCounts[productId].count += item.quantity
                        } else {
                            productCounts[productId] = {
                                ...productDetails,
                                count: item.quantity,
                            }
                        }
                    } else {
                        console.warn('Order item product not populated or is null:', item)
                    }
                })
            })

            const sortedProducts = Object.values(productCounts).sort((a, b) => b.count - a.count)

            const topN = 5
            setFrequentlyPurchased(sortedProducts.slice(0, topN))
        }
    }, [orders])

    const handleAddToCart = (product) => {
        if (addItem) {
            addItem(product, 1)
            alert(`${product.name} added to cart!`)
        } else {
            console.error('addItem function not available from cart context')
        }
    }

    if (orders === null) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Frequently Purchased Items</h2>
                <div className="text-red-500">Loading</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Frequently Purchased Items</h2>
                <div className="text-red-500">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Frequently Purchased Items</h2>

            {frequentlyPurchased.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {frequentlyPurchased.map(product => (
                        <div key={product._id || product.name} className="border p-4 rounded-lg shadow-md flex flex-col bg-white">
                            <h3 className="text-xl font-semibold mb-2 flex-grow">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">Ordered {product.count} times</p>
                            <p className="text-lg font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
                            <div className="mt-auto flex justify-center">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p> Order some items to see your frequently purchased products here! </p>
            )}
        </div>
    )
}

export default UserDashboard