import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProfitChart from '../../components/ProfitChart'

const AdminDashboard = () => {
    const [orders, setOrders] = useState([])
    // const [error, setError] = useState(null) // Error showing after 1-2 seconds, not looking good
    const [view, setView] = useState('monthly') // "monthly" or "annually"
    const [chartData, setChartData] = useState({})

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/orders/admin")
                setOrders(response.data.orders)
            } catch (err) {
                // setError("Failed to fetch orders") // error showing after 1-2 seconds, not looking good
                setOrders([]) // Behave like no orders found
            }
        }

        fetchOrders()
    }, [])

    useEffect(() => {
        const processedData = processOrderData(orders, view)
        setChartData(processedData)
    }, [orders, view])

    const processOrderData = (ordersToProcess, currentView) => {
        // Filter the orders to only find the ones that generated profit
        const profitOrders = ordersToProcess.filter(order => order.status === 'Delivered' || order.status === 'Processing')

        const data = {} // The total profit

        profitOrders.forEach(order => {
            const date = new Date(order.orderDate)
            let key // Time period string

            if (currentView === 'monthly') { // Format: YYYY-MM
                key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
                // date.getMonth() + 1 because indexing starts from 0
                // .padStart(2, '0') - adds '0' at the start of the string if it isn't 2 characters long
            } else { // Format: YYYY
                key = date.getFullYear().toString()
            }

            if (!data[key]) {
                data[key] = 0 // First order for this time period
            }
            data[key] += order.totalAmount
        })

        const sortedKeys = Object.keys(data).sort()

        const formattedData = sortedKeys.map(key => ({
            name: key,
            Profit: data[key]
        }))

        return formattedData
    }

    // This shows after 1-2 seconds, not looking good
    // if (error) {
    //     return <div className="text-center text-xl py-10 text-red-500">{error}</div>
    // }

    return (
        <div className="admin-dashboard-summary p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Profit Over Time</h2>
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setView('monthly')}
                    className={`cursor-pointer mr-4 px-4 py-2 rounded ${view === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                    Monthly View
                </button>
                <button
                    onClick={() => setView('annually')}
                    className={`cursor-pointer px-4 py-2 rounded ${view === 'annually' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                    Annual View
                </button>
            </div>

            {/* The actual chart */}
            <div className="profit-chart-container w-full mb-8">
                <ProfitChart data={chartData} view={view} />
            </div>
        </div>
    )
}

export default AdminDashboard