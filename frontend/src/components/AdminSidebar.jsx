import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin-dashboard",
            icon: "📊",
        },
        {
            name: "Categories",
            path: "/admin-dashboard/categories",
            icon: "📂",
        },
        {
            name: "Products",
            path: "/admin-dashboard/products",
            icon: "📦",
        },
        {
            name: "Orders",
            path: "/admin-dashboard/orders",
            icon: "📋",
        },
        {
            name: "Active users",
            path: "/admin-dashboard/users",
            icon: "👥",
        },
        {
            name: "Settings",
            path: "/admin-dashboard/settings",
            icon: "⚙️",
        },
        {
            name: "Logout",
            path: "/admin-dashboard/logout",
            icon: "➡️",
        },
    ]

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-800 text-white md:w-64 fixed">
            <div className="flex items-center justify-center h-12 mb-4 border-b border-gray-700 pb-3">
                <span className="block text-lg font-bold text-blue-400">
                    Admin Panel
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
                                end={item.path === "/admin-dashboard"}
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

export default AdminSidebar