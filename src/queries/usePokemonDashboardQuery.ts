import { useQuery } from '@tanstack/react-query'
import { fetchPokemonDashboardData } from './getPokemonQuery'

export function usePokemonDashboardQuery(from = 1, to = 1025) {
  return useQuery({
    queryKey: ['pokemon-dashboard', from, to],

    queryFn: () => fetchPokemonDashboardData(from, to),

    staleTime: 1000 * 60 * 60 * 24,
  })
}
