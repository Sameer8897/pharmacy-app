import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  const persist = (payload) => {
    localStorage.setItem('token', payload.token)
    const next = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }
    localStorage.setItem('user', JSON.stringify(next))
    setUser(next)
    return next
  }

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    return persist(data)
  }

  const signup = async (form) => {
    const { data } = await authApi.signup(form)
    return persist(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      signup,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
