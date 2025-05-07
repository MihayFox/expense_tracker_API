import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Root from "./components/Root"
import Login from "./pages/Login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin/dashboard" element={<h1>Admin dashboard</h1>} />
        <Route path="/user/dashboard" element={<h1>User dashboard</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App