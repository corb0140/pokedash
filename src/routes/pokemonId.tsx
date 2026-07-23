import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import PokemonDetails from '@/pages/pokemonId-details'

export const pokemonIdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$pokemonId',
  component: PokemonDetails,
})
