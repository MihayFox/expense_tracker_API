import React from 'react'
import { Outlet } from 'react-router'
import UserSidebar from '../../components/UserSidebar'

const UserDashboard = () => {
    return (
        <div className="flex">
            <UserSidebar />
             <div className="flex-1 ml-64 p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default UserDashboard