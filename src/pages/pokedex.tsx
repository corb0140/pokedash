import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import PokemonDetailModal from '@/components/Modals/PokemonDetailModal'
import PokemonDetailsCard from '@/components/PokemonDetailsCard'
import { usePokemonList } from '@/queries/usePokemonList'
import { usePokemonStore } from '@/stores/pokemonStore'
import SearchBar from '@/components/SearchBar'

function Pokedex() {
  const [isMobile, setIsMobile] = useState(false)

  const { data: pokemonData = [], isLoading, isError } = usePokemonList()

  const {
    filters,
    setFilter,
    setSelectedId,
    openModal,
    closeModal,
    isModalOpen,
  } = usePokemonStore()

  // -------------------------
  // FILTER POKÉMON
  // -------------------------

  const filteredPokemon = pokemonData
    .filter((pokemon) => {
      const search = filters.search.trim().toLowerCase()

      if (!search) return true

      return pokemon.name.toLowerCase().replace('-', ' ').includes(search)
    })
    .sort((a, b) => {
      if (filters.sortAsc) {
        return a.id - b.id
      }

      return b.id - a.id
    })

  // -------------------------
  // MOBILE CHECK
  // -------------------------

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // -------------------------
  // ERROR
  // -------------------------

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg">Failed to load Pokémon.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden lg:h-[calc(100vh-86px)]">
      <div className="mt-5 lg:mt-4 grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-[auto_auto_1fr] lg:gap-4 p-6 lg:px-20">
        <h2 className="uppercase text-4xl lg:hidden">Pokedex</h2>

        {/* SEARCH BAR */}

        <div className="not-lg:mt-10 relative bg-white rounded-xl overflow-hidden flex items-center lg:col-span-4">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilter('search', value)}
          />
        </div>

        {/* POKÉMON DETAILS */}

        <div className="lg:col-span-2 lg:row-span-6 hidden lg:block">
          <PokemonDetailsCard styles="relative h-[81vh] 2xl:h-fit border w-full bg-white overflow-y-scroll no-scrollbar rounded-2xl py-6 2xl:py-10 px-5 shadow-[-2px_0_10px_rgba(0,0,0,0.1)]" />
        </div>

        {/* FILTERS */}

        <div className="flex flex-col gap-4 mt-10 lg:mt-0 lg:col-span-4">
          {/* SORT */}

          <div className="flex justify-between py-2">
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
          </div>
        </div>

        {/* POKÉMON LIST */}

        <div className="lg:col-span-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-10 h-[50vh] 2xl:h-[60vh]">
              <Loader2 className="animate-loader h-16 w-16 text-hp" />

              <p className="mt-4 text-lg">Loading Pokémon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-10 lg:mt-5 lg:px-1 lg:h-[55vh] 2xl:min-h-screen lg:overflow-y-scroll">
              {filteredPokemon.map((pokemon) => (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(pokemon.id)
                    openModal()
                  }}
                  key={pokemon.id}
                  className="bg-white shadow-sm rounded-lg px-5 py-10 lg:py-4 flex flex-col gap-2 items-center relative lg:h-fit"
                >
                  {/* IMAGE */}

                  <div>
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="object-contain h-20 w-20 lg:h-15 lg:w-15"
                    />
                  </div>

                  {/* INFO */}

                  <div className="mt-auto flex flex-col items-center gap-1.5">
                    <p className="text-sm">{`Nº${pokemon.id}`}</p>

                    <p className="text-info-text font-semibold capitalize">
                      {pokemon.name.replace('-', ' ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MOBILE DETAILS MODAL */}

        {isModalOpen && isMobile && (
          <PokemonDetailModal onClose={() => closeModal()} />
        )}
      </div>
    </div>
  )
}

export default Pokedex
