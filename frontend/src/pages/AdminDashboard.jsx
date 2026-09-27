import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { adminApi, medicineApi } from '../api/client'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    manufacturer: '',
    category: '',
    requiresPrescription: false,
    price: '',
    stockQuantity: '',
    imageUrl: '',
  })
  const [formMsg, setFormMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = () => {
    setLoading(true)
    setError('')
    Promise.all([adminApi.dashboard(), medicineApi.list()])
      .then(([adminRes, medsRes]) => {
        setData(adminRes.data)
        setMedicines(medsRes.data || [])
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load admin dashboard'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const createMedicine = async (e) => {
    e.preventDefault()
    setFormMsg('')
    try {
      await medicineApi.create({
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      })
      setFormMsg('Medicine added successfully')
      setForm({
        name: '',
        description: '',
        manufacturer: '',
        category: '',
        requiresPrescription: false,
        price: '',
        stockQuantity: '',
        imageUrl: '',
      })
      loadDashboard()
    } catch (err) {
      setFormMsg(err.response?.data?.message || 'Failed to add medicine')
    }
  }

  return (
    <div className="page">
      <Navbar />
      <section className="section">
        <div className="section-head">
          <h2>Admin dashboard</h2>
          <p>Overview of registered users and placed orders.</p>
        </div>

        {loading && <p className="muted">Loading dashboard…</p>}
        {error && <p className="error-text">{error}</p>}

        {data && (
          <>
            <div className="medicine-grid">
              <article className="cart-summary">
                <h3>Total Users</h3>
                <p className="price lg">{data.totalUsers}</p>
                <p className="muted">{data.totalCustomers} customers · {data.totalAdmins} admins</p>
              </article>
              <article className="cart-summary">
                <h3>Total Orders</h3>
                <p className="price lg">{data.totalOrders}</p>
                <p className="muted">All time orders placed</p>
              </article>
              <article className="cart-summary">
                <h3>Total Revenue</h3>
                <p className="price lg">₹{Number(data.totalRevenue || 0).toFixed(2)}</p>
                <p className="muted">From all placed orders</p>
              </article>
            </div>

            <div className="order-list" style={{ marginTop: '1.5rem' }}>
              <article className="order-card">
                <div className="order-head">
                  <h3>Customers</h3>
                </div>
                {data.customers?.length === 0 && <p className="muted">No customers registered yet.</p>}
                {data.customers?.length > 0 && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th align="left">Name</th>
                          <th align="left">Email</th>
                          <th align="left">Phone</th>
                          <th align="left">Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.customers.map((c) => (
                          <tr key={c.userId}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.phone || '-'}</td>
                            <td>{new Date(c.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className="order-card">
                <div className="order-head">
                  <h3>Recent orders</h3>
                </div>
                {data.recentOrders?.length === 0 && <p className="muted">No orders yet.</p>}
                {data.recentOrders?.length > 0 && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th align="left">Order</th>
                          <th align="left">Customer</th>
                          <th align="left">Email</th>
                          <th align="left">Status</th>
                          <th align="left">Amount</th>
                          <th align="left">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((o) => (
                          <tr key={o.orderId}>
                            <td>#{o.orderId}</td>
                            <td>{o.customerName}</td>
                            <td>{o.customerEmail}</td>
                            <td>{o.status}</td>
                            <td>₹{Number(o.totalAmount).toFixed(2)}</td>
                            <td>{new Date(o.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className="order-card">
                <div className="order-head">
                  <h3>Add medicine</h3>
                </div>
                <form className="form-panel" onSubmit={createMedicine}>
                  <label>Medicine name<input name="name" value={form.name} onChange={onChange} required /></label>
                  <label>Description<textarea name="description" rows={3} value={form.description} onChange={onChange} /></label>
                  <label>Manufacturer<input name="manufacturer" value={form.manufacturer} onChange={onChange} /></label>
                  <label>Category<input name="category" value={form.category} onChange={onChange} /></label>
                  <label>Price<input name="price" type="number" step="0.01" min="0.01" value={form.price} onChange={onChange} required /></label>
                  <label>Stock quantity<input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={onChange} required /></label>
                  <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={onChange} /></label>
                  <label><input name="requiresPrescription" type="checkbox" checked={form.requiresPrescription} onChange={onChange} /> Prescription required</label>
                  <button className="btn btn-primary btn-block" type="submit">Add medicine</button>
                  {formMsg && <p className="muted">{formMsg}</p>}
                </form>
              </article>

              <article className="order-card">
                <div className="order-head">
                  <h3>Current medicines</h3>
                </div>
                <p className="muted">Total catalog items: {medicines.length}</p>
              </article>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
