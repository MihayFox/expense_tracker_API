import React from 'react'
import card1 from "../../assets/images/card1.png"
import trendingUpIcon from "../../assets/images/trendingUpIcon.png"

const AuthLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
                <h2 className="text-lg font-medium text-black">
                    Expense Tracker
                </h2>
                {children}
            </div>

            <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
                <div className="w-48 h-48 rounded-[40px] bg-blue-600 absolute -top-7 -left-5" />
                <div className="w-48 h-56 rounded-[40px] border-[20px] border-blue-700 absolute top-[30%] -right-10" />
                <div className="w-48 h-48 rounded-[40px] bg-blue-500 absolute -bottom-7 -left-5" />
                
                <div className="grid grid-cols-1 z-20">
                    <StatsInfoCard icon={trendingUpIcon} label="Track your Income & Expenses" value="550,000" color="bg-primary" />
                </div>

                <img src={card1} className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400" />
            </div>
        </div>
    )
}

export default AuthLayout

const StatsInfoCard = ({icon, label, value, color}) => {
    return <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-blue-400 border border-gray-200 z-10">
        <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
            <img src={icon} />
        </div>
        <div>
            <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
            <span className="text-[20px]">${value}</span>
        </div>
    </div>
}