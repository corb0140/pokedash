import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import SignUp from '@/pages/signup'

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'signup',
  component: SignUp,
})
