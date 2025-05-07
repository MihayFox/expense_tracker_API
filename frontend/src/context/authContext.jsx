const { createContext, useState, useContext } = require("react")

const authContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("pos-user")
        if (storedUser) {
            return JSON.parse(storedUser)
        } else {
            return null
        }
    })

    const login = (userData, token) => {
        setUser(userData)
        localStorage.setItem("pos-user", JSON.stringify(userData))
        localStorage.setItem("pos-token", token)
    }

    const logout = (userData, token) => {
        setUser(null)
        localStorage.removeItem("pos-user")
        localStorage.removeItem("pos-token")
    }

    return (
        <authContext.Provider value={{ user, login, logout }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider