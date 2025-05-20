import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import axios from 'axios'

const UserOrders = () => {
    const { user } = useAuth()
    const userId = user.id

    const [orders, setOrders] = useState(null)
    const [error, setError] = useState(null)

    const fetchUserOrders = async (id) => {
        try {
            setError(null)

            const response = await axios.get(`http://localhost:3000/api/orders/user/${id}`, {
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
            setError('Failed to fetch your orders. Please try again.')
            if (err.response) {
                setError(err.response.data?.message || `Server responded with status ${err.response.status}`)
            } else if (err.request) {
                setError('Network error. Could not connect to the server.')
            } else {
                setError('An unexpected error occurred while setting up the request.')
            }
        }
    }

    useEffect(() => {
        fetchUserOrders(userId)
    }, [userId, user])

    if (orders === null) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                <div className="text-red-500">Loading</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                <div className="text-red-500">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Orders ({orders.length})</h2>

            {orders.length === 0 ? (
                <div>You haven't placed any orders yet.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                                <span className={`px-2 py-1 rounded-full text-sm font-semibold
                                     ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                                        order.status === 'Cancelled' ? 'bg-red-200 text-red-800' :
                                            'bg-yellow-200 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="mb-3 text-sm text-gray-600">
                                Order Date: {new Date(order.orderDate).toLocaleDateString()}
                            </div>

                            <div className="mb-3">
                                <h4 className="text-md font-medium mb-2">Items:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {order.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            {item.name} x {item.quantity} - ${item.price.toFixed(2)} each
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-right text-lg font-bold text-blue-700">
                                Total: ${order.totalAmount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserOrders