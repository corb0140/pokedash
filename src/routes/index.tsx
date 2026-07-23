import { createRoute } from '@tanstack/react-router'
import App from '../App.tsx'
import { rootRoute } from './__root.tsx'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})
