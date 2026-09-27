import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem } = useCart()

  return (
    <div className="page">
      <Navbar />
      <section className="section">
        <div className="section-head">
          <h2>Your cart</h2>
          <p>{cart.itemCount} item{cart.itemCount === 1 ? '' : 's'}</p>
        </div>

        {loading && <p className="muted">Loading cart…</p>}
        {!loading && cart.items.length === 0 && (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link to="/search" className="btn btn-primary">Browse medicines</Link>
          </div>
        )}

        <div className="cart-layout">
          <div className="cart-list">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-row">
                <img src={item.imageUrl} alt={item.medicineName} />
                <div>
                  <h3>{item.medicineName}</h3>
                  <p className="muted">₹{Number(item.unitPrice).toFixed(2)} each</p>
                  {item.requiresPrescription && <span className="rx-tag">Rx</span>}
                </div>
                <div className="cart-controls">
                  <input
                    type="number"
                    min="1"
                    max={item.stockQuantity}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.medicineId, Number(e.target.value))}
                  />
                  <p className="price">₹{Number(item.lineTotal).toFixed(2)}</p>
                  <button type="button" className="btn btn-ghost" onClick={() => removeItem(item.medicineId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cart.items.length > 0 && (
            <aside className="cart-summary">
              <h3>Summary</h3>
              <p className="summary-row">
                <span>Subtotal</span>
                <strong>₹{Number(cart.totalAmount).toFixed(2)}</strong>
              </p>
              <p className="muted">Test-mode checkout — no real payment charged.</p>
              <Link to="/checkout" className="btn btn-primary btn-block">Proceed to checkout</Link>
            </aside>
          )}
        </div>
      </section>
    </div>
  )
}
