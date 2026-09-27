import { Route, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import CustomerRoute from './components/CustomerRoute'
import Home from './pages/Home'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/medicines/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/cart"
        element={
          <CustomerRoute>
            <Cart />
          </CustomerRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <CustomerRoute>
            <Checkout />
          </CustomerRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <CustomerRoute>
            <OrderHistory />
          </CustomerRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  )
}
