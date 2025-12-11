import { create } from 'zustand'

type User = { id: number; name: string } | null

interface AuthState {
  user: User
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
