import { usePokemonList } from '@/queries/usePokemonList'

export function usePokemonDashboardData(from = 1, to = 1350) {
  const { data = [], isLoading } = usePokemonList(from, to)

  const totalPokemon = data.length

  // TYPES COUNT
  const typeCount: Record<string, number> = {}
  data.forEach((p) =>
    p.types?.forEach((type) => {
      typeCount[type] = (typeCount[type] || 0) + 1
    }),
  )

  const pokemonByType = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
  }))

  // LEGENDARY
  const legendaryCount = data.filter((p) => p.isLegendary).length

  const legendaryPie = [
    { name: 'Legendary Pokemon', value: legendaryCount },
    { name: 'Non-Legendary Pokemon', value: totalPokemon - legendaryCount },
  ]

  // GENERATION
  const generationRanges = [
    { gen: 'Gen 1', from: 1, to: 151 },
    { gen: 'Gen 2', from: 152, to: 251 },
    { gen: 'Gen 3', from: 252, to: 386 },
    { gen: 'Gen 4', from: 387, to: 493 },
    { gen: 'Gen 5', from: 494, to: 649 },
    { gen: 'Gen 6+', from: 650, to: 1350 },
  ]

  const pokemonByGeneration = generationRanges.map((g) => ({
    generation: g.gen,
    count: data.filter((p) => (p.id ?? 0) >= g.from && (p.id ?? 0) <= g.to)
      .length,
  }))

  return {
    isLoading,
    totalPokemon,
    legendaryCount,
    pokemonByType,
    legendaryPie,
    pokemonByGeneration,
  }
}
