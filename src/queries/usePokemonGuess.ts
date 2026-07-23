import { useQuery } from '@tanstack/react-query'
import { getPokemonById } from '@/services/pokeAPI'

export function usePokemonGuess(id: number | null) {
  return useQuery({
    queryKey: ['pokemon-guess', id],
    enabled: !!id,
    queryFn: async () => {
      const pokemon = await getPokemonById(id!)

      return {
        id: pokemon.id,
        name: pokemon.name,
        image:
          pokemon.sprites.other?.showdown?.front_default ||
          pokemon.sprites.other?.dream_world?.front_default ||
          pokemon.sprites.front_default,
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  })
}
