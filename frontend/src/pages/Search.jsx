import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MedicineCard from '../components/MedicineCard'
import { medicineApi } from '../api/client'

const CATEGORIES = ['All', 'Painkiller', 'Antibiotic', 'Vitamin', 'Allergy', 'Digestive', 'Diabetes']

export default function Search() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      const params = {}
      if (query.trim()) params.search = query.trim()
      else if (category !== 'All') params.category = category
      medicineApi
        .list(params)
        .then(({ data }) => setMedicines(data))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(t)
  }, [query, category])

  return (
    <div className="page">
      <Navbar />
      <section className="section">
        <div className="section-head">
          <h2>Search medicines</h2>
          <p>Filter by name, brand, or category.</p>
        </div>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search paracetamol, vitamin, allergy…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="chip-row">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => {
                setCategory(c)
                setQuery('')
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="muted">Searching…</p>}
        {!loading && medicines.length === 0 && <p className="muted">No medicines matched.</p>}
        <div className="medicine-grid">
          {medicines.map((m) => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
