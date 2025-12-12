import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { rootRoute } from './routes/__root.tsx'
import { indexRoute } from './routes/index.tsx'
import { pokemonIdRoute } from './routes/pokemonId.tsx'
import { pokedexRoute } from './routes/pokedex.tsx'
import { compareRoute } from './routes/compare.tsx'
import { favoritesRoute } from './routes/favorites.tsx'
import { teamsRoute } from './routes/teams.tsx'
import { dashboardRoute } from './routes/dashbaord.tsx'
import { profilePageRoute } from './routes/profile-page.tsx'
import { loginRoute } from './routes/login.tsx'

const routeTree = rootRoute.addChildren([
  indexRoute,
  pokemonIdRoute,
  pokedexRoute,
  compareRoute,
  favoritesRoute,
  teamsRoute,
  dashboardRoute,
  profilePageRoute,
  loginRoute,
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient()

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
