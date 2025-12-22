import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { StatTile } from '@/components/Dashboard/StatTile'
import { usePokemonDashboardData } from '@/utils/usePokemonDashboardData'
import { PokemonGenerationBarChart } from '@/components/Dashboard/PokemonByGenerationBarChart'
import { PokemonTypePieChart } from '@/components/Dashboard/PokemonTypePieChart'
import { PokemonLegendaryPieChart } from '@/components/Dashboard/PokemonLegendaryPieChart'

function Dashboard() {
  const {
    isLoading,
    totalPokemon,
    legendaryCount,
    pokemonByType,
    legendaryPie,
    pokemonByGeneration,
  } = usePokemonDashboardData()

  const dots = ['.', '.', '.', '.']
  const dotsRef = useRef<Array<HTMLSpanElement>>([])

  useEffect(() => {
    gsap.fromTo(
      dotsRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        repeat: -1,
        stagger: 0.5,
        ease: 'power1.in',
      },
    )
  }, [dotsRef.current])

  if (isLoading) {
    return (
      <div className="w-full fixed top-[50%] flex items-end justify-center gap-0.5 font-semibold">
        <p className="uppercase bg-linear-to-r from-type-fire to-type-water bg-clip-text text-transparent">
          Gathering information
        </p>

        <div className="uppercase bg-linear-to-r from-type-water to-type-grass bg-clip-text">
          {dots.map((dot, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) dotsRef.current[index] = el
              }}
              className="text-xl text-transparent"
            >
              {dot}
            </span>
          ))}
        </div>
      </div>
    )
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
