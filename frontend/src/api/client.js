import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
}

export const medicineApi = {
  list: (params) => api.get('/medicines', { params }),
  get: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  remove: (id) => api.delete(`/medicines/${id}`),
}

export const cartApi = {
  get: () => api.get('/cart'),
  add: (medicineId, quantity = 1) => api.post('/cart/items', { medicineId, quantity }),
  update: (medicineId, quantity) => api.put(`/cart/items/${medicineId}`, { quantity }),
  remove: (medicineId) => api.delete(`/cart/items/${medicineId}`),
}

export const orderApi = {
  checkout: (shippingAddress) => api.post('/orders/checkout', { shippingAddress }),
  list: () => api.get('/orders'),
  get: (id) => api.get(`/orders/${id}`),
}

export default api
