// Signup.jsx
import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (!name.trim()) {
            setError("Please enter your name.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/signup",
                {
                    name,
                    email,
                    password,
                }
            )

            if (response.data.success) {
                alert("Signup successful! Please login.")
                navigate("/login")
            } else {
                setError(response.data.message || "Signup failed. Please try again.")
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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow max-w-sm mx-auto border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Sign Up
                </h2>
                {error && (
                    <div className="mb-3 p-3 rounded text-sm bg-red-200 text-red-800 border border-red-500">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="name"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Enter Your Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="border border-gray-400 rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-7">
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="font-bold text-sm text-blue-600"
                        >
                            Already have an account? Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup