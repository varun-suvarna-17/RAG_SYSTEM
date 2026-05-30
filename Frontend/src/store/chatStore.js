import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  sessionId: null,
  error: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setSessionId: (sessionId) => set({ sessionId }),

  clearChat: () =>
    set({
      messages: [],
      isLoading: false,
      error: null,
      // keep sessionId so history stays grouped until user starts fresh
    }),

  newSession: () =>
    set({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: null,
    }),

  getLastExchange: () => {
    const { messages } = get()
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    const lastBot = [...messages].reverse().find((m) => m.role === 'assistant')
    return { lastUser, lastBot }
  },
}))

export default useChatStore
