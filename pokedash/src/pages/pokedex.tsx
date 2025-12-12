import { Icon } from '@iconify/react'
import { Suspense, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getAllPokemon, getPokemonByOrderNumber } from '../services/pokeAPI'

export type PokemonProps = {
  id: number
  image: string
  name: string
  order: number
  types: Array<string>
}

function Pokedex() {
  const [pokemonData, setPokemonData] = useState<Array<PokemonProps>>([])

  const [limit, setLimit] = useState(151)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    async function fetchPokemon() {
      const list = await getAllPokemon()

      const appliedLimit = Math.min(limit, offset + 300, list.length)
      const appliedOffset = Math.min(offset, appliedLimit)

      const batch = list.slice(appliedOffset, appliedOffset + appliedLimit)

      const results: Array<PokemonProps> = await Promise.all(
        batch.map(async (item: any) => {
          const id = Number(item.url.split('/').at(-2))
          const res = await getPokemonByOrderNumber(id)

          return {
            id: res.id,
            image: res.sprites.other.dream_world.front_default,
            name: res.name,
            order: res.order,
            types: res.types.map(
              (t: { type: { name: string } }) => t.type.name,
            ),
          }
        }),
      )

      setPokemonData(results)
    }

    fetchPokemon()
  }, [limit, offset])

  const handleLimitChange = (value: number) => {
    if (value < 0) value = 0
    if (value > 10000) value = 10000
    if (Math.abs(value - offset) > 300) value = offset + 300
    setLimit(value)
  }

  const handleOffsetChange = (value: number) => {
    if (value < 0) value = 0
    if (value > 10000) value = 10000
    if (Math.abs(value - limit) > 300) value = limit - 300
    if (value < 0) value = 0
    setOffset(value)
  }

  return (
    <div className="flex flex-col mt-5 p-6">
      {/* SEARCH BAR */}
      <div className="relative flex items-center">
        <input
          type="text"
          className="p-5 shadow-[4px_4px_15px_rgba(0,0,0,0.1)] rounded-xl w-full"
          placeholder="Search your pokemon!"
        />
        <div className="absolute right-4 flex items-center justify-center h-8 w-8 rounded-lg bg-active-link shadow-[0_0_20px_hsl(3,88%,64%)]">
          <Icon
            icon="mynaui:pokeball-solid"
            className="text-white h-4 w-4 relative"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-4 mt-10">
        <div className="flex justify-between py-2">
          <div className="flex gap-1 items-center">
            <p className="text-sm">Ascending</p> <ChevronUp />
          </div>

          {/* LIMIT & OFFSET */}
          <div className="flex gap-3">
            <div className="flex gap-0.5 items-center">
              <p className="text-sm font-semibold">limit:</p>
              <input
                type="number"
                min={0}
                max={10000}
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="p-1 rounded-lg border border-gray-500/80 max-w-20"
              />
            </div>

            <div className="flex gap-0.5 items-center">
              <p className="text-sm font-semibold">offset:</p>
              <input
                type="number"
                min={0}
                max={10000}
                value={offset}
                onChange={(e) => handleOffsetChange(Number(e.target.value))}
                className="p-1 rounded-lg border border-gray-500/80 max-w-20"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {['Type', 'Weakness', 'Ability'].map((item, index) => (
            <span
              key={index}
              className="flex grow items-center justify-between gap-2 text-sm text-link font-bold bg-info-bg p-2 rounded-lg shadow-sm"
            >
              {item} <ChevronDown className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>

      {/* POKEMON LIST */}
      <div className="grid grid-cols-2 gap-4 mt-10">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center mt-10">
              <Loader2 className="animate-loader h-16 w-16 border-red-500" />
              <p className="mt-4 text-lg">Loading Pokémon...</p>
            </div>
          }
        >
          {pokemonData.map((data, index) => (
            <Link
              to="/$pokemonId"
              params={{ pokemonId: (index + 1).toString() }}
              key={data.id}
              className="bg-info-bg shadow-sm rounded-lg px-5 py-10 flex flex-col gap-6 items-center relative"
            >
              <div>
                <img
                  src={data.image}
                  alt={data.name}
                  className="object-contain"
                />
              </div>

              <div className="mt-auto flex flex-col items-center gap-1.5">
                <p>{`Nº${data.id}`}</p>
                <p className="text-info-text font-semibold">
                  {data.name.slice(0, 1).toUpperCase() + data.name.slice(1)}
                </p>

                <div className="flex items-center gap-3 text-sm mt-3">
                  {data.types.map((t, index) => (
                    <span
                      key={index}
                      className="rounded-lg p-2 text-black/70 bg-active-link uppercase font-semibold text-[12px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </Suspense>
      </div>
    </div>
  )
}

export default Pokedex
