import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import { favoritesRoute } from '@/routes/favorites'
import { filterPokemon } from '@/utils/pokemonSelectors'
import { usePokemonStore } from '@/stores/pokemonStore'
import { TYPE_COLORS } from '@/constants/typeColors'
import {
  getAllAbilities,
  getAllPokemonTypes,
  getPokemonById,
  getPokemonTypeData,
} from '@/services/pokeAPI'
import { useFavoritesQuery } from '@/queries/useFavoritesQuery'

export default function Favorites() {
  const navigate = useNavigate()
  const { isAuthenticated } = favoritesRoute.useLoaderData()

  const [favoritePokemon, setFavoritePokemon] = useState<Array<any>>([])
  const { data: favorites, isLoading } = useFavoritesQuery()

  useEffect(() => {
    const fetchFavoritePokemon = async () => {
      try {
        if (!favorites || favorites.length === 0) {
          setFavoritePokemon([])
          return
        }

        const pokemonData = await Promise.all(
          favorites.map(async (f: any) => {
            const data = await getPokemonById(f.pokemon_id)

            return {
              id: data.id,
              name: data.name,
              image: data.sprites.other.showdown.front_default,
              types: data.types.map((t: any) => t.type.name),
              abilities: data.abilities.map((a: any) =>
                a.ability.name.replace('-', ' '),
              ),
              weaknesses: await (async () => {
                const types = data.types.map((t: any) => t.type.name)

                const typeResponses = await Promise.all(
                  types.map(async (typeName: string) => {
                    const typeData = await getPokemonTypeData(typeName)
                    return typeData.damage_relations.double_damage_from.map(
                      (t: { name: string }) => t.name,
                    )
                  }),
                )

                return Array.from(new Set(typeResponses.flat()))
              })(),
            }
          }),
        )

        setFavoritePokemon(pokemonData)
      } catch (error) {
        console.error('Error fetching favorite Pokémon:', error)
      }
    }

    fetchFavoritePokemon()
  }, [favorites])

  const { filters, setFilter, setSelectedId } = usePokemonStore()
  const filteredPokemon = filterPokemon(favoritePokemon, filters)

  const [allTypes, setAllTypes] = useState<Array<string>>([])
  const [allWeaknesses, setAllWeaknesses] = useState<Array<string>>([])
  const [allAbilities, setAllAbilities] = useState<Array<string>>([])

  // FETCH TYPES, WEAKNESSES AND ABILITIES
  useEffect(() => {
    try {
      const fetchTypes = async () => {
        // TYPES & WEAKNESSES
        const typesData = await getAllPokemonTypes()
        const abilitiesData = await getAllAbilities()
        setAllTypes([
          ...typesData.results
            .map((t: any) => t.name)
            .filter((e: string) => e !== 'unknown' && e !== 'stellar'),
        ])
        setAllWeaknesses([
          ...typesData.results
            .map((t: any) => t.name)
            .filter((e: string) => e !== 'unknown' && e !== 'stellar'),
        ])

        // ABILITIES
        setAllAbilities([
          ...abilitiesData.results.map((a: any) => a.name.replace('-', ' ')),
        ])
      }

      fetchTypes()
    } catch (error) {
      console.error('Error fetching types: ', error)
    }
  }, [])

  // AUTH REDIRECT
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate({
          to: '/login',
          search: { redirect: location.pathname },
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="h-[85vh] flex items-center justify-center">
        <div className="text-lg font-medium flex flex-col items-center my-auto">
          <Icon icon="arcticons:pokemon-smile" className="mb-5 h-40 w-40" />

          <p>You must log in to view this page.</p>
          <p>Redirecting to login…</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-[85vh] border flex flex-col gap-3 items-center justify-center">
        <Loader2 className="animate-loader h-10 w-10 text-hp" />
        <p>Loading your favorite Pokémon</p>
      </div>
    )
  }

  return (
    <div className="lg:h-[calc(100vh-86px)] lg:w-[calc(100vw-250px)] mx-auto">
      <div className="p-6 lg:px-20 mt-5 lg:mt-4 grid grid-cols-1">
        <h2 className="uppercase text-4xl lg:hidden">Favorites</h2>

        {/* SEARCH */}
        <div className="not-lg:mt-10 lg:col-span-4 relative bg-white rounded-xl overflow-hidden flex items-center">
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

        {/* FILTERS */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:w-full gap-4 mt-5">
          <div className="flex justify-between py-2">
            {/* SORT */}
            <div
              className="flex gap-1 items-center bg-white py-1.5 px-2.5 rounded-lg cursor-pointer"
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

          {/* SELECTS */}
          <div className="flex gap-2 items-center lg:w-1/2">
            <div className="p-1 bg-white rounded-lg shadow-sm flex-1">
              <select
                value={filters.type ?? ''}
                onChange={(e) => setFilter('type', e.target.value || null)}
                className="w-full text-sm"
              >
                <option value="">Type</option>
                {allTypes.map((t: any) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-sm flex-1">
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

            <div className="p-1 bg-white rounded-lg shadow-sm flex-1">
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
          {filteredPokemon.length < 1 ? (
            <div className="flex flex-col items-center justify-center mt-10 h-[50vh]">
              <p className="text-lg">No Pokémon match the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 lg:mt-5 lg:px-1 lg:h-[55vh] lg:overflow-y-scroll">
              {filteredPokemon.map((data) => (
                <Link
                  to="/$pokemonId"
                  params={{ pokemonId: String(data.id) }}
                  onClick={() => {
                    setSelectedId(data.id ?? 1)
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
