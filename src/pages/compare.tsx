import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import {
  Bar,
  BarChart,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import { usePokemonDetail } from '@/queries/usePokemonDetail'
import { usePokemonSearchList } from '@/queries/usePokemonSearchList'
import PokemonSearch from '@/components/PokemonSearch'
import Loading from '@/components/Loading'

export default function ComparePokemon() {
  const P1_COLOR = 'hsl(200, 70%, 50%)'
  const P2_COLOR = 'hsl(3, 88%, 64%)'

  const [p1, setP1] = useState<{
    id: number | null
    query: string
  }>({
    id: null,
    query: '',
  })

  const [p2, setP2] = useState<{
    id: number | null
    query: string
  }>({
    id: null,
    query: '',
  })

  function formatPokemonName(name: string) {
    return name.replace(/-/g, ' ')
  }

  /*
   * This only loads the lightweight list of all Pokémon.
   *
   * It does NOT load detailed Pokémon data.
   *
   * This allows the search fields to find all Pokémon
   * without waiting for the full Pokedex to load.
   */
  const { data: pokemonList = [], isLoading: isPokemonListLoading } =
    usePokemonSearchList()

  const formattedPokemonList = pokemonList.map((pokemon) => ({
    ...pokemon,
    name: formatPokemonName(pokemon.name),
  }))

  /*
   * Detailed data is only fetched after a Pokémon
   * has been selected.
   *
   * This means we only load the full data for
   * Pokémon 1 and Pokémon 2.
   */
  const { data: pokemon1, isLoading: isPokemon1Loading } = usePokemonDetail(
    p1.id,
  )

  const { data: pokemon2, isLoading: isPokemon2Loading } = usePokemonDetail(
    p2.id,
  )

  /*
   * The comparison page only needs the lightweight
   * Pokémon list to populate the search fields.
   *
   * If the list is loading, show the loading screen.
   */
  if (isPokemonListLoading) {
    return <Loading text="Loading Pokemon Data" />
  }

  /*
   * Create the data used by the stats radar chart.
   */
  const statData =
    pokemon1?.stats && pokemon2?.stats
      ? pokemon1.stats.map((s1: any, index: number) => {
          let statName = s1.name

          if (statName === 'special-attack') {
            statName = 'Spl. Atk'
          }

          if (statName === 'special-defense') {
            statName = 'Spl. Def'
          }

          if (statName !== 'Spl. Atk' && statName !== 'Spl. Def') {
            statName = statName.charAt(0).toUpperCase() + statName.slice(1)
          }

          return {
            stat: statName,
            p1: s1.value,
            p2: pokemon2.stats[index]?.value ?? 0,
          }
        })
      : []

  /*
   * Create data for the Types chart.
   *
   * A Pokémon gets a value of 1 if it has
   * that particular type.
   */
  const typeData = Array.from(
    new Set([...(pokemon1?.types ?? []), ...(pokemon2?.types ?? [])]),
  ).map((type) => ({
    type,
    p1: pokemon1?.types.includes(type) ? 1 : 0,
    p2: pokemon2?.types.includes(type) ? 1 : 0,
  }))

  /*
   * Create data for the Weaknesses chart.
   */
  const effectivenessData = Array.from(
    new Set([...(pokemon1?.weaknesses ?? []), ...(pokemon2?.weaknesses ?? [])]),
  ).map((type) => ({
    type,
    p1: pokemon1?.weaknesses.includes(type) ? 2 : 1,
    p2: pokemon2?.weaknesses.includes(type) ? 2 : 1,
  }))

  /*
   * Check whether either selected Pokémon
   * is currently loading.
   */
  const isComparisonLoading = isPokemon1Loading || isPokemon2Loading

  return (
    <div className="p-4 grid gap-6 mt-5">
      <h2 className="uppercase text-4xl lg:hidden">Compare</h2>

      {/* SELECTORS */}
      <div className="grid grid-cols-2 gap-4 place-items-center">
        <div className="flex gap-4 items-center col-span-2">
          {/* POKÉMON 1 SEARCH */}
          <PokemonSearch
            label="Search Pokémon 1"
            pokemonList={formattedPokemonList}
            value={p1.query}
            onChange={(value) =>
              setP1({
                ...p1,
                query: value,
              })
            }
            onSelect={(pokemon) =>
              setP1({
                id: pokemon.id,
                query: formatPokemonName(pokemon.name),
              })
            }
          />

          {/* SWAP POKÉMON */}
          <button
            className="h-5 w-10 text-info-text"
            onClick={() => {
              setP1(p2)
              setP2(p1)
            }}
            disabled={!p1.id || !p2.id}
          >
            <ArrowLeftRight className="h-full w-full" />
          </button>

          {/* POKÉMON 2 SEARCH */}
          <PokemonSearch
            label="Search Pokémon 2"
            pokemonList={formattedPokemonList}
            value={p2.query}
            onChange={(value) =>
              setP2({
                ...p2,
                query: value,
              })
            }
            onSelect={(pokemon) =>
              setP2({
                id: pokemon.id,
                query: formatPokemonName(pokemon.name),
              })
            }
          />
        </div>
      </div>

      {/* LOADING SELECTED POKÉMON */}
      {p1.id && p2.id && isComparisonLoading ? (
        <Loading text="Loading Pokemon Data" />
      ) : p1.id && p2.id ? (
        <>
          {/* STATS RADAR */}
          <div className="h-auto">
            <h3 className="text-2xl text-center">Stats</h3>

            <div className="h-[40dvh] lg:h-[60dvh] mt-5">
              <ResponsiveContainer>
                <RadarChart data={statData}>
                  <PolarGrid />

                  <PolarAngleAxis dataKey="stat" />

                  <Radar
                    name={formatPokemonName(pokemon1?.name)}
                    dataKey="p1"
                    stroke={P1_COLOR}
                    fill={P1_COLOR}
                    fillOpacity={0.6}
                  />

                  <Radar
                    name={formatPokemonName(pokemon2?.name)}
                    dataKey="p2"
                    stroke={P2_COLOR}
                    fill={P2_COLOR}
                    fillOpacity={0.6}
                  />

                  <Legend
                    wrapperStyle={{
                      bottom: -10,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TYPES */}
          <div className="h-auto mt-8">
            <h3 className="text-2xl mb-5 lg:mb-8 text-center">Types</h3>

            <div className="h-[clamp(260px,40vh,350px)] not-lg:w-full w-[clamp(0px,40vw,650px)] mx-auto">
              <ResponsiveContainer>
                <BarChart data={typeData}>
                  <XAxis dataKey="type" />

                  <Legend />

                  <Bar
                    dataKey="p1"
                    name={formatPokemonName(pokemon1?.name)}
                    fill={P1_COLOR}
                  />

                  <Bar
                    dataKey="p2"
                    name={formatPokemonName(pokemon2?.name)}
                    fill={P2_COLOR}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TYPE EFFECTIVENESS */}
          <div className="h-auto mt-8">
            <h3 className="text-2xl mb-5 text-center">Weaknesses</h3>

            <div className="h-[clamp(256px,40vh,350px)] not-lg:w-full w-[clamp(0px,50vw,700px)] mx-auto">
              <ResponsiveContainer>
                <BarChart data={effectivenessData}>
                  <XAxis dataKey="type" />

                  <YAxis />

                  <Legend />

                  <Bar
                    dataKey="p1"
                    name={`${formatPokemonName(pokemon1?.name)} weak to`}
                    fill={P1_COLOR}
                  />

                  <Bar
                    dataKey="p2"
                    name={`${formatPokemonName(pokemon2?.name)} weak to`}
                    fill={P2_COLOR}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ABILITIES & MOVES */}
          <div className="grid grid-cols-2 gap-4 w-[clamp(350px,55vw,600px)] mx-auto my-8">
            <h3 className="col-span-2 text-2xl text-center">
              Abilities & Moves
            </h3>

            {[pokemon1, pokemon2].map((pokemon, index) => (
              <div
                key={index}
                className="border-2 border-b-info-text rounded p-3"
              >
                <h3
                  className="font-bold capitalize mb-2"
                  style={{
                    color: index === 0 ? P1_COLOR : P2_COLOR,
                  }}
                >
                  {formatPokemonName(pokemon?.name) || `Pokémon ${index + 1}`}
                </h3>

                {/* ABILITIES */}
                <div className="h-[20%]">
                  <p className="text-sm font-semibold">Abilities</p>

                  <ul className="text-sm capitalize mt-1">
                    {pokemon?.abilities?.length ? (
                      pokemon.abilities.map((ability: string) => (
                        <li key={ability}>{ability}</li>
                      ))
                    ) : (
                      <li>-</li>
                    )}
                  </ul>
                </div>

                {/* MOVES */}
                <div className="mt-2 h-auto">
                  <p className="text-sm font-semibold">Moves</p>

                  <ul className="text-sm h-60 overflow-y-auto capitalize mt-1">
                    {pokemon?.moves?.length ? (
                      pokemon.moves.map((move: string) => (
                        <li key={move}>{move}</li>
                      ))
                    ) : (
                      <li>-</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /*
         * No Pokémon have been selected yet.
         */
        <div className="w-full fixed left-0 top-[50%] -translate-y-[50%] flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-30 w-30"
            viewBox="0 0 24 24"
          >
            <path
              fill="hsl(349, 74%, 50%)"
              d="M14.5 12a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0m7.5 0c0 5.52-4.48 10-10 10S2 17.52 2 12S6.48 2 12 2s10 4.48 10 10m-2 0h-4c0-2.21-1.79-4-4-4s-4 1.79-4 4H4c0 4.41 3.59 8 8 8s8-3.59 8-8"
              strokeWidth="0.4"
              stroke="hsl(349, 74%, 50%)"
            />
          </svg>

          <p className="text-center p-2">Select two pokemon to compare</p>
        </div>
      )}
    </div>
  )
}
