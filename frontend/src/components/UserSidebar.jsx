import React from 'react'
import { NavLink } from 'react-router-dom'

const UserSidebar = () => {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/user/dashboard",
            icon: "🏠",
        },
        {
            name: "Products",
            path: "/user/products",
            icon: "🛍️",
        },
        {
            name: "My Orders",
            path: "/user/orders",
            icon: "📜",
        },
        {
            name: "My Profile",
            path: "/user/profile",
            icon: "👤",
        },
        {
            name: "Cart",
            path: "/user/cart",
            icon: "🛒",
        },
        {
            name: "Logout",
            path: "/user/logout",
            icon: "➡️",
        },
    ]

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-800 text-white w-64 fixed">
            <div className="flex items-center justify-center h-12 mb-4 border-b border-gray-700 pb-3">
                <span className="block text-lg font-bold text-blue-400">
                    User Panel
                </span>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center py-2 px-2 rounded ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                                }
                                end={item.path === "/user-dashboard"}
                            >
                                <span className="mr-2">
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default UserSidebar