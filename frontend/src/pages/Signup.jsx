import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signup(form)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || data?.email || data?.password || 'Signup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <section className="section narrow">
        <div className="section-head">
          <h2>Create account</h2>
          <p>Sign up to save your cart and place orders.</p>
        </div>
        <form className="form-panel" onSubmit={onSubmit}>
          <label>
            Full name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={onChange} />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={6} value={form.password} onChange={onChange} required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Creating…' : 'Sign up'}
          </button>
          <p className="muted center">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
