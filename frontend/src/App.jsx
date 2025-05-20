import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Root from "./components/Root"
import Homepage from "./pages/Homepage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"

// Admin pages
import AdminLayout from './layouts/AdminLayout' // Layout
import AdminDashboard from './pages/admin/AdminDashboard' // Chart
import AdminCategories from './pages/admin/AdminCategories'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'

// User pages
import UserLayout from './layouts/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import UserProducts from './pages/user/UserProducts'
import UserOrders from './pages/user/UserOrders'
import UserProfile from './pages/user/UserSettings'
import UserCart from './pages/user/UserCart'

// Contexts
import { AuthProvider } from './context/authContext'
import { CartProvider } from './context/cartContext'

// Common pages
import Logout from './components/common/Logout'


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="logout" element={<Logout />} />

            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="/user" element={<CartProvider> <UserLayout /> </CartProvider>} >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="products" element={<UserProducts />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="logout" element={<Logout />} />

            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
