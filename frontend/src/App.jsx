import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Root from "./components/Root"
import Homepage from "./pages/Homepage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard' // This is the layout
import AdminDashboardSummary from './pages/admin/AdminDashboardSummary' // This is the chart content
import AdminCategories from './pages/admin/AdminCategories'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'

// User pages
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
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardSummary />} /> {/* this will render when the user goes to /admin-dashboard | child route*/}
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="logout" element={<Logout />} />
          </Route>

          <Route
            path="/user-dashboard/*"
            element={
              <CartProvider>
                <UserDashboard />
              </CartProvider>
            }
          >
            <Route index element={<h1>User Dashboard Welcome</h1>} />
            <Route path="products" element={<UserProducts />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="logout" element={<Logout />} />
          </Route>


          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App