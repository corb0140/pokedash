import { StatTile } from '@/components/Dashboard/StatTile'
import { usePokemonDashboardData } from '@/utils/usePokemonDashboardData'
import { PokemonGenerationBarChart } from '@/components/Dashboard/PokemonByGenerationBarChart'
import { PokemonTypePieChart } from '@/components/Dashboard/PokemonTypePieChart'
import { PokemonLegendaryPieChart } from '@/components/Dashboard/PokemonLegendaryPieChart'
import Loading from '@/components/Loading'

function Dashboard() {
  const {
    isLoading,
    totalPokemon,
    legendaryCount,
    pokemonByType,
    legendaryPie,
    pokemonByGeneration,
  } = usePokemonDashboardData()

  if (isLoading) {
    return <Loading text="Gathering Information" />
  }

  return (
    <div className="p-6 lg:px-20">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Pokémon" value={totalPokemon} />
        <StatTile label="Legendaries" value={legendaryCount} />
        <StatTile
          label="Legendary %"
          value={`${Math.round((legendaryCount / totalPokemon) * 100)}%`}
        />
        <StatTile label="Unique Types" value={pokemonByType.length} />

        <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur p-4 shadow">
          <h3 className="mb-2 font-semibold">Pokémon by Type</h3>
          <PokemonTypePieChart data={pokemonByType} />
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur p-4 shadow">
          <h3 className="mb-2 font-semibold">Legendary Distribution</h3>
          <PokemonLegendaryPieChart data={legendaryPie} />
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-white/70 backdrop-blur p-4 shadow">
          <h3 className="mb-2 font-semibold">Pokémon by Generation</h3>
          <PokemonGenerationBarChart data={pokemonByGeneration} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
