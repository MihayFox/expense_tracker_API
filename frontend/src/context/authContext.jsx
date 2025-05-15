import { createContext, useState, useContext } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        try {
            const parsedUser = storedUser ? JSON.parse(storedUser) : null
            return parsedUser
        } catch (e) {
            console.error("Error parsing user from localStorage:", e)
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            return null
        }
    })

    const login = (userData, token) => {
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", token)
    }

    const logout = () => {
        if (user.role === 'user') {
            localStorage.removeItem("cart")
        }
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider