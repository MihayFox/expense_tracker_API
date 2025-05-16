import React from 'react';
import { Outlet } from 'react-router'
import AdminSidebar from '../../components/AdminSidebar'

const AdminDashboard = () => {
    return (
        <div className="flex">
            <AdminSidebar />

            <div className="flex-1 ml-64 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboard