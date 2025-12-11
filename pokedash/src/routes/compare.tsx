import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Compare from '@/pages/compare'

export const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'compare',
  component: Compare,
})
