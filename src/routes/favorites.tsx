import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Favorites from '@/pages/favorites'
import { useAuth } from '@/stores/authStore'
import { api } from '@/services/restfulAPI'

export const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'favorites',

  loader: async () => {
    const { user, setUser, clearUser } = useAuth.getState()

    if (user) {
      return { isAuthenticated: true, user }
    }

    try {
      const res = await api.post('/auth/refresh')
      if (res.data.user) {
        setUser(res.data.user)
        return { isAuthenticated: true, user: res.data.user }
      } else {
        clearUser()
        return { isAuthenticated: false, user: null }
      }
    } catch {
      clearUser()
      return { isAuthenticated: false, user: null }
    }
  },

  component: Favorites,
})
