import { useNavigate } from "react-router"
import { useAuth } from "../context/authContext"
import { useEffect } from "react"

const Root = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
a
    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard")
            } else if (user.role === "user") {
                navigate("/user/dashboard")
            } else {
                navigate("/login")
            }
        } else {
            navigate("/login")
        }
    }, [user, navigate]) // whenever user or navigate modify

    return null
}

export default Root