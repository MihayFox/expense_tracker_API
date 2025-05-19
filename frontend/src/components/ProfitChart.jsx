import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ProfitChart = ({ data, view }) => {

    if (!data || data.length === 0) {
        return <div className="text-center text-red-500 text-xl py-10 font-bold">No chart data available.</div>
    }

    let xAxisLabel
    if (view === "monthly") {
        xAxisLabel = "Month"
    } else {
        xAxisLabel = "Year"
    }

    const strokeColor = "#8884d8"
    const gridColor = "#ccc"

    return (
        <ResponsiveContainer height={400}>
            <LineChart data={data} margin={{ right: 40, left: 60, bottom: 20, top: 20 }}>

                <CartesianGrid stroke={gridColor} />
                <XAxis dataKey="name" label={{ value: xAxisLabel, position: "bottom" }} />
                <YAxis label={{ value: 'Profit ($)', angle: -90, position: "insideLeft", offset: -10 }} />
                <Tooltip />
                <Line type="natural" dataKey="Profit" stroke={strokeColor} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default ProfitChart