import { Icon } from '@iconify/react'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { usePokemonData } from '@/queries/getPokemonQuery'
import PokemonDetailModal from '@/components/Modals/PokemonDetailModal'
import { TYPE_COLORS } from '@/constants/typeColors'

function Pokedex() {
  const [id, setId] = useState<number | undefined>(1)
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(1350)
  const [fromInput, setFromInput] = useState(from)
  const [toInput, setToInput] = useState(to)
  const [search, setSearch] = useState<string>('')
  const [modal, setModal] = useState<boolean>(false)

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
    <div className="flex flex-col mt-5 p-6 lg:px-20">
      {/* SEARCH BAR */}
      <div className="relative bg-white rounded-2xl overflow-hidden flex items-center w-full lg:max-w-220">
        <input
          type="text"
          className="p-5 lg:p-3 shadow-[4px_4px_15px_rgba(0,0,0,0.1)] w-full"
          placeholder="Search your pokemon!"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="absolute right-4 flex items-center justify-center h-8 w-8 lg:h-6 lg:w-6 rounded-xl bg-active-link shadow-[0_0_20px_hsl(3,88%,64%)]">
          <Icon
            icon="mynaui:pokeball-solid"
            className="text-white h-4 w-4 lg:h-3 lg:w-3 relative"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-4 mt-10 lg:mt-5 lg:max-w-220">
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
              className="flex grow items-center justify-between gap-2 text-xs text-link font-bold bg-white p-2 rounded-lg shadow-sm"
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
        <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-flow-row lg:gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-10 lg:mt-5 lg:px-1 lg:col-span-4 lg:h-[55vh] lg:overflow-y-scroll">
            {filteredPokemon.map((data) => (
              <div
                onClick={() => {
                  setId(data.id)
                  setModal(true)
                }}
                key={data.id}
                className="bg-white shadow-sm rounded-lg px-5 py-10 lg:py-4 flex flex-col gap-2 items-center relative lg:max-h-80"
              >
                <div>
                  <img
                    src={data.image}
                    alt={data.name}
                    className="object-contain h-20 w-20 lg:h-15 lg:w-15"
                  />
                </div>

                <div className="mt-auto flex flex-col items-center gap-1.5">
                  <p className="text-sm">{`Nº${data.id}`}</p>

                  <p className="text-info-text font-semibold capitalize">
                    {data.name}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {data.types?.map((t, i) => (
                      <span
                        key={i}
                        className={`rounded-lg p-2 text-white ${TYPE_COLORS[t]} uppercase font-semibold text-xs`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 relative -top-51 hidden lg:block">
            {id && <PokemonDetailModal id={id} />}
          </div>
        </div>
      )}

      {modal && window.innerWidth < 1024 && (
        <PokemonDetailModal id={id} onClose={() => setModal(false)} />
      )}
    </div>
  )
}

export default Pokedex
