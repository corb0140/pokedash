import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Favorites from '@/pages/favorites'
import { useAuth } from '@/stores/auth'

export const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'favorites',

  beforeLoad: () => {
    const user = useAuth.getState().user
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href || '/' },
      })
    }
  },

  component: Favorites,
})
