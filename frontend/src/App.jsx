import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Root from "./components/Root"
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import Categories from './components/Categories'
import Products from './components/Products'
import Logout from './components/Logout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin-dashboard" element={<Dashboard />}>
          <Route index element={<h1>Summary of dashboard</h1>}/>
          <Route path="categories" element={<Categories />}/>
          <Route path="products" element={<Products />}/>
          <Route path="orders" element={<h1>Orders</h1>}/>
          <Route path="users" element={<h1>Users</h1>}/>
          <Route path="settings" element={<h1>Settings</h1>}/>
          <Route path="logout" element={<Logout />}/>
        </Route>
        <Route path="/user-dashboard" element={<h1>User dashboard</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App