import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from './getPokemonQuery'

export function usePokemonSearchList() {
  return useQuery({
    queryKey: ['pokemon-search-list'],
    queryFn: fetchPokemonList,
    staleTime: 1000 * 60 * 60 * 24,
  })
}
