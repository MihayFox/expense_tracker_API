import { useEffect } from "react"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"

const Root = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                navigate("/admin")
            } else if (user.role === "user") {
                navigate("/user")
            } else {
                navigate("/login")
            }
        } else {
            navigate("/homepage")
        }
    }, [user, navigate])

    return null
}

export default Root