import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach admin token to protected admin routes
api.interceptors.request.use((config) => {
  const { token, username } = useAuthStore.getState()
  const isAdminRoute =
    config.url?.includes('/admin/') && !config.url?.includes('/admin/login')

  if (isAdminRoute && token && username) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Admin-User'] = username
  }

  return config
})

// Surface API error messages in a consistent shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'
    return Promise.reject(
      typeof message === 'string' ? new Error(message) : new Error(JSON.stringify(message))
    )
  }
)

export default api
