import React, { useState } from "react"
import { useAuth } from "../context/authContext"
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
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",
                {
                    email,
                    password,
                }
            )
            if (response.data.success) {
                await login(response.data.user, response.data.token)
                if (response.data.user.role === "admin") {
                    navigate("/admin-dashboard")
                } else {
                    navigate("/user-dashboard")
                }
            } else {
                setError(
                    response.data.message ||
                    "Login failed. Please check your credentials."
                )
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || `Error: ${err.response.status}`)
            } else {
                setError("An unexpected error occurred.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        < div className="flex items-center justify-center h-screen bg-gray-100" >
            < div className="bg-white p-6 rounded shadow max-w-sm mx-auto border border-gray-300" >
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Login
                </h2>
                {
                    error && (
                        <div className="mb-3 p-3 rounded text-sm bg-red-200 text-red-800 border border-red-500">
                            {error}
                        </div>
                    )
                }
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="email"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Enter Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Enter Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Logging In..." : "Login"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="font-bold text-sm text-blue-600"
                        >
                            Don't have an account? Sign Up
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default Login