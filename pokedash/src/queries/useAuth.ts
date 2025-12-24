import { useMutation } from '@tanstack/react-query'
import { api } from '../services/restfulAPI'
import { useAuth } from '../stores/authStore'
import type { User } from '../stores/authStore'

/* ---------- API CALLS ---------- */

type SignupPayload = {
  email: string
  username: string
  password: string
}

type LoginPayload = {
  identifier: string
  password: string
}

const signupRequest = async (data: SignupPayload) => {
  const res = await api.post('/auth/signup', data)
  return res.data
}

const loginRequest = async (data: LoginPayload) => {
  const res = await api.post('/auth/login', data)
  return res.data
}

const logoutRequest = async () => {
  const res = await api.post('/auth/logout')
  return res.data
}

const deleteRequest = async () => {
  const res = await api.delete('/auth/delete-account')
  return res.data
}

const refreshRequest = async () => {
  const res = await api.post('/auth/refresh')
  return res.data
}

/* ---------- MUTATIONS ---------- */

export const useAuthMutations = () => {
  const { setUser, clearUser } = useAuth()

  const signup = useMutation({
    mutationFn: signupRequest,
    onSuccess: (data) => {
      setUser(data.user as User)
    },
  })

  const login = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setUser(data.user as User)
    },
  })

  const logout = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      clearUser()
    },
  })

  const deleteAccount = useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      clearUser()
    },
  })

  const refresh = useMutation({
    mutationFn: refreshRequest,
    onSuccess: (data) => {
      setUser(data.user as User)
    },
  })

  return {
    signup,
    login,
    logout,
    deleteAccount,
    refresh,
  }
}
