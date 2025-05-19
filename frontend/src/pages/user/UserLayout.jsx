import React from 'react'
import { Outlet } from 'react-router'
import UserSidebar from '../../components/UserSidebar'

const UserDashboard = () => {
    return (
        <div>
            <UserSidebar />

             <div className="ml-64">
                <Outlet />
            </div>
        </div>
    )
}

export default UserDashboard