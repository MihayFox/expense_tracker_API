import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"

const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true)
        setError(null)

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/signup",
                {
                    email,
                    password,
                }
            )

            console.log(response.data);

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
                    <div className="bg-red-200 text-red-700">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Email</label>
                        <input
                            type="email"
                            className="border w-full text-gray-700"
                            name="email"
                            placeholder="Enter Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Password</label>
                        <input
                            type="password"
                            className="border w-full text-gray-700"
                            name="password"
                            placeholder="Enter Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold">Confirm Password</label>
                        <input
                            type="password"
                            className="border w-full text-gray-700"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white font-bold w-full">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;
