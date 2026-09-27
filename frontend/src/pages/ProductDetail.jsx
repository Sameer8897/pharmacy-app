import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { medicineApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { isAuthenticated, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const [medicine, setMedicine] = useState(null)
  const [qty, setQty] = useState(1)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    medicineApi
      .get(id)
      .then(({ data }) => setMedicine(data))
      .catch(() => setError('Medicine not found'))
  }, [id])

  const handleAdd = async () => {
    if (isAdmin) {
      setMsg('Admin account cannot buy medicines')
      return
    }
    if (!isAuthenticated) {
      setMsg('Please log in first')
      return
    }
    try {
      await addToCart(medicine.id, qty)
      setMsg('Added to cart')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add')
    }
  }

  return (
    <div className="page">
      <Navbar />
      <section className="section detail">
        {error && <p className="error-text">{error}</p>}
        {medicine && (
          <div className="detail-grid">
            <div className="detail-media">
              <img src={medicine.imageUrl} alt={medicine.name} />
            </div>
            <div className="detail-info">
              <p className="medicine-meta">
                {medicine.category}
                {medicine.requiresPrescription && <span className="rx-tag">Prescription required</span>}
              </p>
              <h1>{medicine.name}</h1>
              <p className="medicine-mfr">{medicine.manufacturer}</p>
              <p className="detail-desc">{medicine.description}</p>
              <p className="price lg">₹{Number(medicine.price).toFixed(2)}</p>
              <p className="muted">{medicine.stockQuantity} in stock</p>
              <div className="qty-row">
                <label htmlFor="qty">Qty</label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max={medicine.stockQuantity}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
                <button type="button" className="btn btn-primary" onClick={handleAdd}>
                  Add to cart
                </button>
              </div>
              {msg && <p className="inline-msg">{msg}</p>}
              {!isAdmin && <Link to="/cart" className="text-link">Go to cart →</Link>}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
