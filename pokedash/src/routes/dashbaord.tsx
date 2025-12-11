import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Dashboard from '@/pages/dashboard'

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: Dashboard,
})
