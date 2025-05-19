import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [error, setError] = useState(null)
    const [updateError, setUpdateError] = useState(null)

    // Possible order statuses
    const possibleStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

    const fetchOrders = async () => {
        try {
            setError(null)
            setUpdateError(null)

            const response = await axios.get("http://localhost:3000/api/orders/admin", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (response.data.success) {
                setOrders(response.data.orders)
            } else {
                setError(response.data.message || 'Failed to fetch orders')
            }

        } catch (err) {
            setError('Failed to fetch orders. Please try again.')
        }
    }

    // NEW FUNCTION to handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdateError(null)

        try {
            const response = await axios.patch(`http://localhost:3000/api/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.data.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? response.data.order : order
                    )
                )
            } else {
                setUpdateError(response.data.message || `Failed to update status for order ${orderId}`)
                fetchOrders()
            }

        } catch (err) {
            console.error("Update status error:", err)
            setUpdateError(`Failed to update status for order ${orderId}. Please try again.`)
            fetchOrders()
        }
    }


    useEffect(() => {
        fetchOrders()
    }, [])

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Orders</h2>
                <div className="text-red-500">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Orders ({orders.length})</h2>

            {updateError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{updateError}</span>
                </div>
            )}


            {orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Order ID</th>
                                <th className="py-2 px-4 border-b text-left">Customer</th>
                                <th className="py-2 px-4 border-b text-left">Items</th>
                                <th className="py-2 px-4 border-b text-right">Total Amount</th>
                                <th className="py-2 px-4 border-b text-left">Status</th>
                                <th className="py-2 px-4 border-b text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-sm">{order._id}</td>
                                    <td className="py-2 px-4 border-b text-sm">
                                        {order.user ? order.user.name : 'N/A'}
                                    </td>
                                    <td className="py-2 px-4 border-b text-sm">
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                {item.name} ({item.quantity})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4 border-b text-right text-sm">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="py-2 px-4 border-b text-sm">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`cursor-pointer p-1 rounded-md text-xs font-semibold border
                                                ${order.status === 'Delivered' ? 'bg-green-200 text-green-800 border-green-300' :
                                                    order.status === 'Cancelled' ? 'bg-red-200 text-red-800 border-red-300' :
                                                        'bg-yellow-200 text-yellow-800 border-yellow-300'}`}
                                        >
                                            {possibleStatuses.map(status => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border-b text-sm">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminOrders