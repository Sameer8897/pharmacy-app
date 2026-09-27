import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { cart } = useCart()

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden>✚</span>
          <span className="brand-text">MediCart</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/search">Search</NavLink>
          {isAuthenticated && <NavLink to="/orders">Orders</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Cart
            {cart.itemCount > 0 && <span className="cart-badge">{cart.itemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
