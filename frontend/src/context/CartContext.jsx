import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cartApi } from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 })
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalAmount: 0, itemCount: 0 })
      return
    }
    setLoading(true)
    try {
      const { data } = await cartApi.get()
      setCart(data)
    } catch {
      setCart({ items: [], totalAmount: 0, itemCount: 0 })
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addToCart = async (medicineId, quantity = 1) => {
    const { data } = await cartApi.add(medicineId, quantity)
    setCart(data)
    return data
  }

  const updateQuantity = async (medicineId, quantity) => {
    const { data } = await cartApi.update(medicineId, quantity)
    setCart(data)
    return data
  }

  const removeItem = async (medicineId) => {
    const { data } = await cartApi.remove(medicineId)
    setCart(data)
    return data
  }

  const value = useMemo(
    () => ({ cart, loading, refresh, addToCart, updateQuantity, removeItem }),
    [cart, loading, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
