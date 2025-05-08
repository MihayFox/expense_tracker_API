import React from 'react'

const Sidebar = () => {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin-dashboard",
            icon: "",
        },
        {
            name: "Categories",
            path: "/admin-dashboard/categories",
            icon: "",
        },
        {
            name: "Products",
            path: "/admin-dashboard/products",
            icon: "",
        },
        {
            name: "Orders",
            path: "/admin-dashboard/orders",
            icon: "",
        },
        {
            name: "Active users",
            path: "/admin-dashboard/users",
            icon: "",
        },
        {
            name: "Settings",
            path: "/admin-dashboard/settings",
            icon: "",
        },
        {
            name: "Logout",
            path: "/admin-dashboard/logout",
            icon: "",
        },
    ]

    return (
        <div className="flex flex-col h-screen p-3 bg-black text-white w-16 md:w-64 shadow-lg fixed">
            <div className="h-16 flex flex-items justify-center">
                <span className="hidden md:block text-xl font-bold">Inventory Management System</span> {/* big screen */}
            </div>
            
            <div>
                <ul className="space-y-2 p-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <span className="text-xl flex items-center p-2 text-white rounded-lg group">{item.icon}</span>
                            <a href={item.path} className="ml-3 flex items-center p-2 text-white rounded-lg group hover:bg-gray-600">{item.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
