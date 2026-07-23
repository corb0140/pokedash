import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Teams from '@/pages/teams'
import { useAuth } from '@/stores/authStore'
import { api } from '@/services/restfulAPI'

export const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'teams',

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
