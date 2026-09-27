import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { orderApi } from '../api/client'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    orderApi
      .list()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <Navbar />
      <section className="section">
        <div className="section-head">
          <h2>Order history</h2>
          <p>Past purchases with price snapshots.</p>
        </div>

        {location.state?.placed && (
          <p className="success-banner">Order #{location.state.placed} placed successfully.</p>
        )}

        {loading && <p className="muted">Loading orders…</p>}
        {!loading && orders.length === 0 && (
          <div className="empty-state">
            <p>No orders yet.</p>
            <Link to="/search" className="btn btn-primary">Start shopping</Link>
          </div>
        )}

        <div className="order-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-head">
                <h3>Order #{order.id}</h3>
                <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <p className="muted">
                {new Date(order.createdAt).toLocaleString()} · Payment {order.paymentId}
              </p>
              <p className="muted">{order.shippingAddress}</p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.medicineName} × {item.quantity} — ₹{Number(item.lineTotal).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="price">Total ₹{Number(order.totalAmount).toFixed(2)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
