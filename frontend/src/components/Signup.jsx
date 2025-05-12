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

            console.log(response.data)

            if (response.data.success) {
                alert("Signup successful! Please login.")
                navigate("/login")
            } else {
                setError(response.data.message || "Signup failed. Please try again.")
            }
        } catch (err) {
            console.log(err)
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
        <div className="flex flex-col items-center h-screen justify-center">
            <h2 className="text-3xl text-gray-800">Sign Up Page</h2>
            <div className="border p-6 w-80 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
                {error && (
                    <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-1">Name</label>
                        <input
                            type="text"
                            className="border w-full text-gray-700 p-2 rounded"
                            name="name"
                            placeholder="Enter Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-1">Email</label>
                        <input
                            type="email"
                            className="border w-full text-gray-700 p-2 rounded"
                            name="email"
                            placeholder="Enter Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-1">Password</label>
                        <input
                            type="password"
                            className="border w-full text-gray-700 p-2 rounded"
                            name="password"
                            placeholder="Enter Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="border w-full text-gray-700 p-2 rounded"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white font-bold w-full py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`} // Added styling and loading state
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
