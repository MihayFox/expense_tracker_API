import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'

const AdminDashboard = () => {
    return (
        <div>
            <AdminSidebar />

            <div className="ml-64">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboard