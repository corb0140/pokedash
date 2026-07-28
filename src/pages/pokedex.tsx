import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

import PokemonDetailModal from '@/components/Modals/PokemonDetailModal'
import PokemonDetailsCard from '@/components/PokemonDetailsCard'
import SearchBar from '@/components/SearchBar'

import { TYPE_COLORS } from '@/constants/typeColors'
import { filterPokemon } from '@/utils/pokemonSelectors'
import { usePokemonList } from '@/queries/usePokemonList'
import { usePokemonStore } from '@/stores/pokemonStore'

function Pokedex() {
  const [isMobile, setIsMobile] = useState(false)

  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(1025)

  const [fromInput, setFromInput] = useState(from)
  const [toInput, setToInput] = useState(to)

  // Reference to the scrollable Pokémon list
  const pokemonListRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = usePokemonList(from, to)

  // Flatten all loaded pages into one Pokémon array
  const pokemonData = data?.pages.flat() ?? []

  console.log('Pokemon data:', pokemonData)
  console.log('Loading:', isLoading)
  console.log('Loading next page:', isFetchingNextPage)
  console.log('Has next page:', hasNextPage)
  console.log('Error:', error)

  const {
    filters,
    setFilter,
    setSelectedId,
    openModal,
    closeModal,
    isModalOpen,
  } = usePokemonStore()

  const filteredPokemon = filterPokemon(pokemonData, filters)

  // Get filter options from currently loaded Pokémon
  const allTypes = [...new Set(pokemonData.flatMap((pokemon) => pokemon.types))]

  const allWeaknesses = [
    ...new Set(pokemonData.flatMap((pokemon) => pokemon.weaknesses)),
  ]

  const allAbilities = [
    ...new Set(pokemonData.flatMap((pokemon) => pokemon.abilities)),
  ]

  // MOBILE CHECK
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // LAZY LOAD MORE POKÉMON
  useEffect(() => {
    const container = pokemonListRef.current

    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container

      // Distance from the bottom of the scroll container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      // Start loading the next batch when
      // the user is within 300px of the bottom
      const nearBottom = distanceFromBottom < 300

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // RANGES
  function applyRange() {
    const newFrom = Math.max(1, Math.min(fromInput, toInput))

    const newTo = Math.max(newFrom, Math.min(toInput, 1025))

    setFrom(newFrom)
    setTo(newTo)

    setFromInput(newFrom)
    setToInput(newTo)
  }

  return (
    <div className="overflow-hidden lg:h-[calc(100vh-86px)]">
      <div className="mt-5 lg:mt-4 grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-[auto_auto_1fr] lg:gap-4 p-6 lg:px-20">
        {/* MOBILE TITLE */}
        <h2 className="uppercase text-4xl lg:hidden">Pokedex</h2>

        {/* SEARCH BAR */}
        <div className="not-lg:mt-10 relative bg-white rounded-xl overflow-hidden flex items-center lg:col-span-4">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilter('search', value)}
          />
        </div>

        {/* POKÉMON DETAILS CARD */}
        <div className="lg:col-span-2 lg:row-span-6 hidden lg:block">
          <PokemonDetailsCard styles="relative h-[81vh] 2xl:h-fit border w-full bg-white overflow-y-scroll no-scrollbar rounded-2xl py-6 2xl:py-10 px-5 shadow-[-2px_0_10px_rgba(0,0,0,0.1)]" />
        </div>

        {/* FILTERS */}
        <div className="flex flex-col gap-4 mt-10 lg:mt-0 lg:col-span-4">
          <div className="flex justify-between py-2">
            {/* SORT */}
            <div
              className="flex gap-1 items-center bg-white py-2 px-1.5 rounded-lg cursor-pointer shrink"
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

            {/* FROM / TO */}
            <div className="flex gap-2">
              {/* FROM */}
              <div className="flex gap-0.5 items-center">
                <p className="text-sm">From:</p>

                <input
                  type="number"
                  min={1}
                  max={1025}
                  value={fromInput}
                  onChange={(e) => setFromInput(Number(e.target.value))}
                  onBlur={applyRange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      applyRange()
                    }
                  }}
                  className="p-1 rounded-lg border border-link/80 max-w-15"
                />
              </div>

              {/* TO */}
              <div className="flex gap-0.5 items-center">
                <p className="text-sm">To:</p>

                <input
                  type="number"
                  min={1}
                  max={1025}
                  value={toInput}
                  onChange={(e) => setToInput(Number(e.target.value))}
                  onBlur={applyRange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      applyRange()
                    }
                  }}
                  className="p-1 rounded-lg border border-link/80 max-w-18"
                />
              </div>
            </div>
          </div>

          {/* SELECT FILTERS */}
          <div className="flex gap-2">
            {/* TYPE */}
            <div className="p-1 bg-white rounded-lg shadow-sm flex-1">
              <select
                value={filters.type ?? ''}
                onChange={(e) => setFilter('type', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Type</option>

                {allTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* WEAKNESS */}
            <div className="p-1 bg-white rounded-lg shadow-sm flex-1">
              <select
                value={filters.weakness ?? ''}
                onChange={(e) => setFilter('weakness', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Weakness</option>

                {allWeaknesses.map((weakness) => (
                  <option key={weakness} value={weakness}>
                    {weakness}
                  </option>
                ))}
              </select>
            </div>

            {/* ABILITY */}
            <div className="p-1 bg-white rounded-lg shadow-sm flex-1">
              <select
                value={filters.ability ?? ''}
                onChange={(e) => setFilter('ability', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Ability</option>

                {allAbilities.map((ability) => (
                  <option key={ability} value={ability}>
                    {ability.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* POKÉMON LIST */}
        <div className="lg:col-span-4">
          {isLoading ? (
            // INITIAL LOADING
            <div className="flex flex-col items-center justify-center mt-10 h-[50vh] 2xl:h-[60vh]">
              <Loader2 className="animate-loader h-16 w-16 text-hp" />

              <p className="mt-4 text-lg">Loading Pokémon</p>
            </div>
          ) : error ? (
            // ERROR
            <div className="flex flex-col items-center justify-center mt-10 h-[50vh]">
              <p className="text-lg">Failed to load Pokémon.</p>

              <p className="text-sm text-red-500 mt-2">
                {error instanceof Error
                  ? error.message
                  : 'Something went wrong.'}
              </p>
            </div>
          ) : (
            <div
              ref={pokemonListRef}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-10 lg:mt-5 lg:px-1 lg:h-[55vh] 2xl:min-h-screen lg:overflow-y-scroll"
            >
              {filteredPokemon.map((filteredData) => (
                <div
                  onClick={() => {
                    setSelectedId(filteredData.id)
                    openModal()
                  }}
                  key={filteredData.id}
                  className="bg-white shadow-sm rounded-lg px-5 py-10 lg:py-4 flex flex-col gap-2 items-center relative lg:h-fit cursor-pointer"
                >
                  {/* IMAGE */}
                  <div>
                    <img
                      src={filteredData.image}
                      alt={filteredData.name}
                      className="object-contain h-20 w-20 lg:h-15 lg:w-15"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="mt-auto flex flex-col items-center gap-1.5">
                    {/* NUMBER */}
                    <p className="text-sm">{`Nº${filteredData.id}`}</p>

                    {/* NAME */}
                    <p className="text-info-text font-semibold capitalize">
                      {filteredData.name.replace('-', ' ')}
                    </p>

                    {/* TYPES */}
                    <div className="flex items-center gap-3 mt-3">
                      {filteredData.types.map((type, index) => (
                        <span
                          key={`${filteredData.id}-${type}-${index}`}
                          className={`rounded-lg p-2 text-white ${TYPE_COLORS[type]} uppercase font-semibold text-xs`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* NEXT PAGE LOADING */}
              {isFetchingNextPage && (
                <div className="col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-8">
                  <Loader2 className="animate-loader h-8 w-8 text-hp" />

                  <p className="mt-2 text-sm">Loading more Pokémon...</p>
                </div>
              )}

              {/* ALL POKÉMON LOADED */}
              {!hasNextPage && !isFetchingNextPage && (
                <div className="col-span-2 lg:col-span-3 flex justify-center py-6">
                  <p className="text-sm text-gray-500">All Pokémon loaded</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE POKÉMON DETAILS MODAL */}
        {isModalOpen && isMobile && (
          <PokemonDetailModal onClose={() => closeModal()} />
        )}
      </div>
    </div>
  )
}

export default Pokedex
