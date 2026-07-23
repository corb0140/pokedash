import { useQuery } from '@tanstack/react-query'
import { fetchPokemonRange } from './getPokemonQuery'

export function usePokemonList(from = 1, to = 1025) {
  return useQuery({
    queryKey: ['pokemon-list', from, to],
    queryFn: () => fetchPokemonRange(from, to),
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: (previousData) => previousData,
  })
}
