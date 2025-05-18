import axios from 'axios'
import React, { useState, useEffect } from 'react'

const Users = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    })

    const [errorMessage, setErrorMessage] = useState(null)
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/users/get",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            setUsers(response.data.users)
            setErrorMessage(null)
        } catch (err) {
            console.error("Error fetching users:", err)
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(`Error fetching users: ${err.response.data.message}`)
            } else {
                setErrorMessage("Failed to fetch users. Server error.")
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        setErrorMessage(null)

        try {
            const response = await axios.post(
                "http://localhost:3000/api/users/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )

            if (response.data.success) {
                alert("User added successfully!")
                setFormData({ name: "", email: "", password: "", role: "user" })
                fetchUsers()
            }
        } catch (err) {
            console.error("Error adding user:", err)
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message)
            } else {
                setErrorMessage("Failed to add user. Server error.")
            }
        }
    }

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) return

        try {
            const response = await axios.delete(
                `http://localhost:3000/api/users/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            if (response.data.success) {
                alert("User deleted successfully!")
                fetchUsers()
            }
        } catch (err) {
            console.error("Error deleting user:", err)
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(`Error deleting user: ${err.response.data.message}`)
            } else {
                setErrorMessage("Failed to delete user. Server error.")
            }
        }
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white shadow p-4 rounded border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Add New User
                    </h2>
                    {errorMessage && (
                        <div className="text-red-600 text-sm mb-3">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleAddUser} className="space-y-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="w-full border border-gray-400 rounded p-2"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full border border-gray-400 rounded p-2"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full border border-gray-400 rounded p-2"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            name="role"
                            className="w-full border border-gray-400 rounded p-2 bg-white"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>

                        <div className="flex">
                            <button
                                type="submit"
                                className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                            >
                                Add User
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-white shadow p-4 rounded border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">User List</h2>
                    {errorMessage && users.length === 0 && (
                        <div className="text-red-600 text-sm mb-3">
                            {errorMessage}
                        </div>
                    )}
                    <table className="min-w-full table-auto border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border border-gray-300 text-left">#</th>
                                <th className="p-2 border border-gray-300 text-left">Name</th>
                                <th className="p-2 border border-gray-300 text-left">Email</th>
                                <th className="p-2 border border-gray-300 text-left">Role</th>
                                <th className="p-2 border border-gray-300 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id} className="text-left border-b border-gray-300">
                                    <td className="p-2 border border-gray-300">{index + 1}</td>
                                    <td className="p-2 border border-gray-300">{user.name}</td>
                                    <td className="p-2 border border-gray-300">{user.email}</td>
                                    <td className="p-2 border border-gray-300">{user.role}</td>
                                    <td className="p-2 border border-gray-300 text-center">
                                        <button
                                            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                                            onClick={() => handleDeleteUser(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Users