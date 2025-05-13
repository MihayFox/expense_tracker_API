import { useNavigate } from "react-router"

const Homepage = () => {
    const navigate = useNavigate()

    return (
        < div className="flex flex-col items-center justify-center h-screen bg-gray-100" >
            < div className="bg-white p-6 rounded shadow text-center max-w-md mx-auto border border-gray-300" >
                < h1 className="text-2xl font-bold mb-4 text-gray-800" >
                    Inventory Management System
                </h1 >
                < p className="text-base text-gray-700 mb-6" >
                    Get started by logging in or creating a new account.
                </p >
                < div className="flex gap-4 justify-center" >
                    < button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-blue-500 text-white text-base font-semibold rounded hover:bg-blue-600"
                    >
                        Login
                    </button >
                    < button
                        onClick={() => navigate("/signup")}
                        className="px-4 py-2 bg-green-500 text-white text-base font-semibold rounded hover:bg-green-600"
                    >
                        Sign Up
                    </button >
                </div >
            </div >
        </div >
    )
}

export default Homepage