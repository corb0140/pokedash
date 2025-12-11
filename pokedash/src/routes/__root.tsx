import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})
