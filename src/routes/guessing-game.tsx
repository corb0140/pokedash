import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import GuessPokemon from '@/pages/guessing-game'

export const guessPokemonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'guessing-game',
  component: GuessPokemon,
})
