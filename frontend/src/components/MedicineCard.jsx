import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function MedicineCard({ medicine }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const { addToCart } = useCart()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const handleAdd = async () => {
    if (isAdmin) {
      setMsg('Admin account cannot buy medicines')
      return
    }
    if (!isAuthenticated) {
      setMsg('Log in to add items')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      await addToCart(medicine.id, 1)
      setMsg('Added')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not add')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="medicine-card">
      <Link to={`/medicines/${medicine.id}`} className="medicine-media">
        <img
          src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'}
          alt={medicine.name}
          loading="lazy"
        />
      </Link>
      <div className="medicine-body">
        <p className="medicine-meta">
          {medicine.category}
          {medicine.requiresPrescription && <span className="rx-tag">Rx</span>}
        </p>
        <h3>
          <Link to={`/medicines/${medicine.id}`}>{medicine.name}</Link>
        </h3>
        <p className="medicine-mfr">{medicine.manufacturer}</p>
        <div className="medicine-footer">
          <p className="price">₹{Number(medicine.price).toFixed(2)}</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd} disabled={isAdmin || busy || medicine.stockQuantity < 1}>
            {medicine.stockQuantity < 1 ? 'Out of stock' : busy ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
        {msg && <p className="inline-msg">{msg}</p>}
      </div>
    </article>
  )
}
