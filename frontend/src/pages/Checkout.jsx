import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { orderApi } from '../api/client'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { cart, refresh } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const placeOrder = async (e) => {
    e.preventDefault()
    setError('')
    if (!address.trim()) {
      setError('Shipping address is required')
      return
    }
    setBusy(true)
    try {
      const { data } = await orderApi.checkout(address.trim())
      await refresh()
      navigate(`/orders`, { state: { placed: data.id } })
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed')
    } finally {
      setBusy(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="page">
        <Navbar />
        <section className="section empty-state">
          <p>Nothing to checkout.</p>
          <Link to="/search" className="btn btn-primary">Shop medicines</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      <section className="section narrow">
        <div className="section-head">
          <h2>Checkout</h2>
          <p>Dummy payment — order is marked PAID with a test payment id.</p>
        </div>

        <form className="form-panel" onSubmit={placeOrder}>
          <label>
            Shipping address
            <textarea
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat / Street, City, PIN"
              required
            />
          </label>

          <div className="checkout-lines">
            {cart.items.map((item) => (
              <p key={item.id} className="summary-row">
                <span>{item.medicineName} × {item.quantity}</span>
                <span>₹{Number(item.lineTotal).toFixed(2)}</span>
              </p>
            ))}
            <p className="summary-row total">
              <span>Total</span>
              <strong>₹{Number(cart.totalAmount).toFixed(2)}</strong>
            </p>
          </div>

          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Placing order…' : 'Place order (test pay)'}
          </button>
        </form>
      </section>
    </div>
  )
}
