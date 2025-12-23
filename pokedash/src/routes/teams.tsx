import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Teams from '@/pages/teams'
import { useAuth } from '@/stores/auth'

export const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'teams',

  loader: () => {
    const user = useAuth.getState().user

    return {
      isAuthenticated: !!user,
    }
  },

  // beforeLoad: () => {
  //   const user = useAuth.getState().user
  //   if (!user) {
  //     throw redirect({
  //       to: '/login',
  //       search: { redirect: location.href || '/' },
  //     })
  //   }
  // },

  component: Teams,
})
