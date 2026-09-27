import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MedicineCard from '../components/MedicineCard'
import { medicineApi } from '../api/client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    medicineApi
      .list()
      .then(({ data }) => setMedicines(data))
      .catch(() => setError('Could not load medicines. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">MediCart Pharmacy</p>
          <h1>Medicines delivered with care</h1>
          <p className="hero-sub">
            Search trusted brands, add to cart, and checkout in minutes — portfolio demo with test payments.
          </p>
          <div className="hero-cta">
            <Link to="/search" className="btn btn-primary">Browse medicines</Link>
            <Link to="/signup" className="btn btn-secondary">Create account</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200"
            alt=""
          />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Popular medicines</h2>
          <p>Seed catalog for local development — admin can add stock via API.</p>
        </div>
        {loading && <p className="muted">Loading catalog…</p>}
        {error && <p className="error-text">{error}</p>}
        <div className="medicine-grid">
          {medicines.map((m) => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
