import { useNavigate } from "react-router"

const Homepage = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Homepage</h1>
            <div className="flex space-x-4">
                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-500 text-white">
                    Login
                </button>
                <button
                    onClick={() => navigate("/signup")}
                    className="bg-green-500 text-white">
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Homepage