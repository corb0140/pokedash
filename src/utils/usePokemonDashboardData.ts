import { usePokemonDashboardQuery } from '@/queries/usePokemonDashboardQuery'

export function usePokemonDashboardData(from = 1, to = 1025) {
  const { data = [], isLoading, isError } = usePokemonDashboardQuery(from, to)

  const totalPokemon = data.length

  // -------------------------
  // TYPES
  // -------------------------

  const typeCount: Record<string, number> = {}

  data.forEach((pokemon) => {
    pokemon.types.forEach((type) => {
      typeCount[type] = (typeCount[type] || 0) + 1
    })
  })

  const pokemonByType = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
  }))

  // -------------------------
  // LEGENDARY
  // -------------------------

  const legendaryCount = data.filter((pokemon) => pokemon.isLegendary).length

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

  // -------------------------
  // GENERATIONS
  // -------------------------

  const generationRanges = [
    {
      gen: 'Gen 1',
      from: 1,
      to: 151,
    },
    {
      gen: 'Gen 2',
      from: 152,
      to: 251,
    },
    {
      gen: 'Gen 3',
      from: 252,
      to: 386,
    },
    {
      gen: 'Gen 4',
      from: 387,
      to: 493,
    },
    {
      gen: 'Gen 5',
      from: 494,
      to: 649,
    },
    {
      gen: 'Gen 6+',
      from: 650,
      to: 1025,
    },
  ]

  const pokemonByGeneration = generationRanges.map((generation) => ({
    generation: generation.gen,

    count: data.filter(
      (pokemon) => pokemon.id >= generation.from && pokemon.id <= generation.to,
    ).length,
  }))

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
