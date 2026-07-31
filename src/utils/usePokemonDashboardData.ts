import { usePokemonDashboardQuery } from '@/queries/usePokemonDashboardQuery'

export function usePokemonDashboardData(from = 1, to = 1025) {
  const { data, isLoading, isError } = usePokemonDashboardQuery(from, to)

  const totalPokemon = data?.totalPokemon ?? 0
  const legendaryCount = data?.legendaryCount ?? 0
  const pokemonByType = data?.pokemonByType ?? []
  const pokemonByGeneration = data?.pokemonByGeneration ?? []

  const legendaryPie = [
    {
      name: 'Legendary Pokemon',
      value: legendaryCount,
    },
    {
      name: 'Non-Legendary Pokemon',
      value: totalPokemon - legendaryCount,
    },
  ]

  return {
    isLoading,
    isError,

    totalPokemon,

    legendaryCount,

    pokemonByType,

    legendaryPie,

    pokemonByGeneration,
  }
}
