import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { adminApi } from '../api/client'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi
      .dashboard()
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load admin dashboard'))
      .finally(() => setLoading(false))
  }, [])

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
            </div>
          </>
        )}
      </section>
    </div>
  )
}
