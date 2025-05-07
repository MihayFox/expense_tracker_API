const { React } = require("react")
const { ReactDOM } = require("react-dom/client")
const { App } = require("./App.jsx")
const { AuthProvider } = require("./context/AuthContext.jsx")

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
)