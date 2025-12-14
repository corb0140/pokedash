import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Favorites from '@/pages/favorites'
import { useAuth } from '@/stores/auth'

export const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'favorites',

  loader: () => {
    const user = useAuth.getState().user

    return {
      isAuthenticated: !!user,
    }
  },

  component: Favorites,
})
