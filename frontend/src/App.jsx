import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Root from "./components/Root"
import Homepage from "./components/Homepage"
import Signup from "./components/Signup"
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import Categories from './components/Categories'
import Products from './components/Products'
import Users from './components/Users'
import Settings from './components/Settings'
import Logout from './components/Logout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/admin-dashboard" element={<Dashboard />}>
          <Route index element={<h1>Summary of dashboard</h1>} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="/user-dashboard" element={<h1>User dashboard</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App