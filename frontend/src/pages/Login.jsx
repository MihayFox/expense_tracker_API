import React, { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router"
import axios from "axios"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const { login } = useAuth()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = axios.post("https://localhost:3000/api/login", {
                email, password
            })
            if (response.data.status) {
                await login(response.data.user, response.data.token)
                if (response.data.user === "admin") {
                    navigate("/admin/dashboard")
                } else {
                    navigate("/user/dashboard")
                }
            } else {
                alert(response.data.error)
            }
        } catch (err) {
            setError(err.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center">
            <h2 className="text-3xl text-black">Inventory Manager</h2>
            <div className="border shadow-lg p-6 w-80 bg-white">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && (
                    <div className="bg-red-500 text-red-700 p-2 mb-4 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border"
                            name="email"
                            placeholder="Enter Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password"
                            className="w-full px-3 py-2 border"
                            name="password"
                            placeholder="Enter Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-400 text-white py-1">
                        {loading ? "Loading... " : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login