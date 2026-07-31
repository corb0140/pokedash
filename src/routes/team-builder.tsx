import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import TeamBuilder from '@/pages/team-builder'

export const teamBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'team-builder',
  component: TeamBuilder,
})
