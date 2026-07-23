import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from './getPokemonQuery'

export function usePokemonList() {
  return useQuery({
    queryKey: ['pokemon-list'],
    queryFn: fetchPokemonList,
    staleTime: 1000 * 60 * 60 * 24,
  })
}
