import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import PokemonDetailModal from '@/components/Modals/PokemonDetailModal'
import PokemonDetailsSideBar from '@/components/PokemonDetailsSidaBar'
import { TYPE_COLORS } from '@/constants/typeColors'
import { filterPokemon } from '@/utils/pokemonSelectors'
import { usePokemonList } from '@/queries/usePokemonList'
import { usePokemonStore } from '@/stores/pokemonStore'

function Pokedex() {
  const [isMobile, setIsMobile] = useState(false)
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(1350)
  const [fromInput, setFromInput] = useState(from)
  const [toInput, setToInput] = useState(to)

  const { data: pokemonData = [], isLoading } = usePokemonList(from, to)

  const {
    filters,
    setFilter,
    setSelectedId,
    openModal,
    closeModal,
    isModalOpen,
  } = usePokemonStore()

  const filteredPokemon = filterPokemon(pokemonData, filters)

  const allTypes = Array.from(
    new Set(pokemonData.flatMap((p) => p.types ?? [])),
  )
  const allWeaknesses = Array.from(
    new Set(pokemonData.flatMap((p) => p.weaknesses ?? [])),
  )
  const allAbilities = Array.from(
    new Set(pokemonData.flatMap((p) => p.abilities ?? [])),
  )

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  function applyRange() {
    const newFrom = Math.max(1, Math.min(fromInput, toInput))
    const newTo = Math.max(newFrom, toInput)
    setFrom(newFrom)
    setTo(newTo)
    setFromInput(newFrom)
    setToInput(newTo)
  }

  return (
    <div className="overflow-hidden lg:h-[calc(100vh-86px)]">
      <div className="mt-5 lg:mt-4 grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-[auto_auto_1fr] lg:gap-4 p-6 lg:px-20">
        {/* SEARCH BAR */}
        <div className="relative bg-white rounded-xl overflow-hidden flex items-center lg:col-span-4">
          <input
            type="text"
            className="p-5 lg:p-3 shadow-[4px_4px_15px_rgba(0,0,0,0.1)] w-full"
            placeholder="Search your pokemon!"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />

          <div className="absolute right-4 flex items-center justify-center h-8 w-8 lg:h-6 lg:w-6 rounded-xl bg-active-link shadow-[0_0_20px_hsl(3,88%,64%)]">
            <Icon
              icon="mynaui:pokeball-solid"
              className="text-white h-4 w-4 lg:h-3 lg:w-3 relative"
            />
          </div>
        </div>

        {/* POKEMON MODAL */}
        <div className="lg:col-span-2 lg:row-span-6 hidden lg:block">
          <PokemonDetailsSideBar />
        </div>

        {/* FILTERS */}
        <div className="flex flex-col gap-4 mt-10 lg:mt-0 lg:col-span-4">
          <div className="flex justify-between py-2">
            {/* SORT */}
            <div
              className="flex gap-1 items-center bg-white p-1.5 rounded-lg cursor-pointer"
              onClick={() => setFilter('sortAsc', !filters.sortAsc)}
            >
              <p className="text-sm">
                {filters.sortAsc ? 'Ascending' : 'Descending'}
              </p>
              {filters.sortAsc ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>

            {/* FROM TO */}
            <div className="flex gap-3">
              <div className="flex gap-0.5 items-center">
                <p className="text-sm">From:</p>
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
                <p className="text-sm">To:</p>
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

          {/* SELECTS */}
          <div className="flex gap-2">
            <div className="p-1 bg-white rounded-lg shadow-sm grow">
              <select
                value={filters.type ?? ''}
                onChange={(e) => setFilter('type', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Type</option>
                {allTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-sm grow">
              <select
                value={filters.weakness ?? ''}
                onChange={(e) => setFilter('weakness', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Weakness</option>
                {allWeaknesses.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-sm grow">
              <select
                value={filters.ability ?? ''}
                onChange={(e) => setFilter('ability', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Ability</option>
                {allAbilities.map((a: any) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* POKEMON LIST */}
        <div className="lg:col-span-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-10 h-[50vh]">
              <Loader2 className="animate-loader h-16 w-16 text-red-500" />
              <p className="mt-4 text-lg">Loading Pokémon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-10 lg:mt-5 lg:px-1 lg:h-[55vh] lg:overflow-y-scroll">
              {filteredPokemon.map((data) => (
                <div
                  onClick={() => {
                    setSelectedId(data.id ?? 1)
                    openModal()
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
          )}
        </div>

        {isModalOpen && isMobile && (
          <PokemonDetailModal onClose={() => closeModal()} />
        )}
      </div>
    </div>
  )
}

export default Pokedex
