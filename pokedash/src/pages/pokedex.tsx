import { Icon } from '@iconify/react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { usePokemonData } from '@/queries/getPokemonQuery'
import PokemonDetailModal from '@/components/Modals/PokemonDetailModal'

function Pokedex() {
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(1350)
  const [fromInput, setFromInput] = useState(from)
  const [toInput, setToInput] = useState(to)
  const [search, setSearch] = useState<string>('')
  const [modal, setModal] = useState<{
    id?: number
    shown?: boolean
  }>({
    id: 0,
    shown: false,
  })

  const { data: pokemonData = [], isLoading } = usePokemonData(from, to)

  /**
   * @description
   * Creates a filtered list of Pokémon based on the current search query.
   * The filtering is case-insensitive and matches any Pokémon whose name
   * contains the search text.
   *
   * Depends on:
   * - `pokemonData`: the full list of fetched Pokémon
   * - `search`: the user's input in the search bar
   */
  const filteredPokemon = pokemonData.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  )

  function applyRange() {
    const newFrom = Math.max(1, Math.min(fromInput, toInput))
    const newTo = Math.max(newFrom, toInput)
    setFrom(newFrom)
    setTo(newTo)
    setFromInput(newFrom)
    setToInput(newTo)
  }

  return (
    <div className="flex flex-col mt-5 p-6">
      {/* SEARCH BAR */}
      <div className="relative flex items-center">
        <input
          type="text"
          className="p-5 shadow-[4px_4px_15px_rgba(0,0,0,0.1)] rounded-xl w-full"
          placeholder="Search your pokemon!"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

          {/* FROM TO */}
          <div className="flex gap-3">
            <div className="flex gap-0.5 items-center">
              <p className="text-sm font-semibold">From:</p>
              <input
                type="number"
                min={1}
                max={10000}
                value={fromInput}
                onChange={(e) => setFromInput(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyRange()
                }}
                className="p-1 rounded-lg border border-gray-500/80 max-w-20"
              />
            </div>

            <div className="flex gap-0.5 items-center">
              <p className="text-sm font-semibold">To:</p>
              <input
                type="number"
                min={1}
                max={10000}
                value={toInput}
                onChange={(e) => setToInput(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyRange()
                }}
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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-10 h-[50vh]">
          <Loader2 className="animate-loader h-16 w-16 text-red-500" />
          <p className="mt-4 text-lg">Loading Pokémon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-10">
          {filteredPokemon.map((data) => (
            <div
              onClick={() =>
                setModal({
                  id: data.id,
                  shown: true,
                })
              }
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
                <p className="text-info-text font-semibold capitalize">
                  {data.name}
                </p>

                <div className="flex items-center gap-3 text-sm mt-3">
                  {data.types?.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-lg p-2 text-black/70 bg-active-link uppercase font-semibold text-[12px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.shown && (
        <PokemonDetailModal
          id={modal.id}
          onClose={() =>
            setModal({
              id: 0,
              shown: false,
            })
          }
        />
      )}
    </div>
  )
}

export default Pokedex
