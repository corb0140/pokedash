import { useQuery } from '@tanstack/react-query'
import { pokemonKeys } from './pokemonKeys'
import { fetchAllPokemon } from '@/queries/getPokemonQuery'

export function usePokemonList(from: number, to: number) {
  return useQuery({
    queryKey: pokemonKeys.list(from, to),
    queryFn: () => fetchAllPokemon(from, to),
    staleTime: 1000 * 60 * 60,
    gcTime: Infinity,
  })
}
