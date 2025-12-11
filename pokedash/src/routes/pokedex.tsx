import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Pokedex from '@/pages/pokedex'

export const pokedexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'pokedex',
  component: Pokedex,
})
