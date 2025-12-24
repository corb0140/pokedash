import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { User } from '@/stores/authStore'
import { api } from '@/services/restfulAPI'
import { useAuth } from '@/stores/authStore'

export const useAuthQuery = () => {
  const { setUser, clearUser } = useAuth()

  const query = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.post('/auth/refresh')
      return res.data
    },
    retry: false,
  })

  useEffect(() => {
    if (query.isSuccess && query.data?.user) {
      setUser(query.data.user as User)
    }
    if (query.isError) {
      clearUser()
    }
  }, [query.isSuccess, query.isError, query.data, setUser, clearUser])

  return query
}
