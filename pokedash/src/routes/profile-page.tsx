import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import ProfilePage from '@/pages/profile-page'

export const profilePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'profile-page',
  component: ProfilePage,
})
