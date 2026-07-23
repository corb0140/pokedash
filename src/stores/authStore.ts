import { create } from 'zustand'

export type User = { id: string; email: string; username: string } | null

interface AuthState {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
