import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: '',
      token: '',

      login: (username, token) =>
        set({ isAuthenticated: true, username, token }),

      logout: () =>
        set({ isAuthenticated: false, username: '', token: '' }),
    }),
    { name: 'void-ai-auth' }
  )
)

export default useAuthStore
