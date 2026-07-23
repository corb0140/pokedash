import { QueryClient } from '@tanstack/react-query'
import {
  getAllPokemon,
  getPokemonById,
  getPokemonSpeciesById,
  getPokemonTypeData,
} from '../services/pokeAPI'

export type PokemonProps = {
  id: number
  image: string
  name: string
  order: number
  types: Array<string>
  abilities: Array<string>
  weaknesses: Array<string>
  isLegendary: boolean
  isMythical: boolean
}

export type PokemonListItem = {
  id: number
  name: string
  image: string
}

export type PokemonTypeData = {
  name: string
  strongAgainst: Array<string>
  weakAgainst: Array<string>
  immuneTo: Array<string>
}

export const queryClient = new QueryClient()

/**
 * Generate a Pokémon sprite URL without
 * making another API request.
 */
export function getPokemonImage(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`
}

/**
 * Fetch the lightweight Pokémon list.
 *
 * This only makes ONE API request for all Pokémon.
 * It does NOT fetch individual Pokémon details.
 */
export async function fetchPokemonList(): Promise<Array<PokemonListItem>> {
  const list = await getAllPokemon()

  return list.map((pokemon: { name: string; url: string }) => {
    const id = Number(pokemon.url.split('/').at(-2))

    return {
      id,
      name: pokemon.name,
      image: getPokemonImage(id),
    }
  })
}

/**
 * Fetch complete data for a single Pokémon.
 *
 * This is only called when detailed information
 * about a specific Pokémon is required.
 */
export async function fetchPokemonById(id: number): Promise<PokemonProps> {
  const [pokemon, species] = await Promise.all([
    getPokemonById(id),
    getPokemonSpeciesById(id),
  ])

  const types = pokemon.types.map(
    (t: { type: { name: string } }) => t.type.name,
  )

  /**
   * Fetch type data from TanStack Query cache.
   *
   * If the type has already been requested,
   * TanStack Query can reuse the cached result.
   */
  const typeResponses = await Promise.all(
    types.map((type: any) =>
      queryClient.fetchQuery({
        queryKey: ['pokemon-type', type],
        queryFn: () => getPokemonTypeData(type),
        staleTime: 1000 * 60 * 60 * 24,
      }),
    ),
  )

  const weaknesses = Array.from(
    new Set(
      typeResponses.flatMap((typeData) =>
        typeData.damage_relations.double_damage_from.map(
          (type: { name: string }) => type.name,
        ),
      ),
    ),
  )

  return {
    id: pokemon.id,

    image:
      pokemon.sprites.other.showdown.front_default ||
      pokemon.sprites.other.dream_world.front_default,

    name: pokemon.name,

    order: pokemon.order,

    types,

    abilities: pokemon.abilities.map(
      (ability: { ability: { name: string } }) => ability.ability.name,
    ),

    weaknesses,

    isLegendary: species.is_legendary,

    isMythical: species.is_mythical,
  }
}

/**
 * Fetch all Pokémon types.
 *
 * This is useful for your Type Match-Ups page.
 * Only 18 type requests are required.
 */
export async function fetchAllPokemonTypes() {
  const types = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ]

  return Promise.all(
    types.map(async (type) => {
      const data = await queryClient.fetchQuery({
        queryKey: ['pokemon-type', type],
        queryFn: () => getPokemonTypeData(type),
        staleTime: 1000 * 60 * 60 * 24,
      })

      return {
        name: type,

        strongAgainst: data.damage_relations.double_damage_to.map(
          (item: { name: string }) => item.name,
        ),

        weakAgainst: data.damage_relations.double_damage_from.map(
          (item: { name: string }) => item.name,
        ),

        immuneTo: data.damage_relations.no_damage_from.map(
          (item: { name: string }) => item.name,
        ),
      }
    }),
  )
}

/**
 * Fetch Pokémon data required for the dashboard.
 *
 * Retrieves the lightweight Pokémon list first, then fetches
 * only the details needed for dashboard statistics:
 * - Pokémon ID
 * - Pokémon types
 * - Legendary status
 *  Pokémon are processed in batches to limit the number of
 * concurrent API requests and reduce the risk of rate limiting
 * or request failures.
 */
export type PokemonDashboardData = {
  id: number
  types: Array<string>
  isLegendary: boolean
}

const DASHBOARD_BATCH_SIZE = 50

export async function fetchPokemonDashboardData(
  from = 1,
  to = 1025,
): Promise<Array<PokemonDashboardData>> {
  // Get the lightweight list first
  const pokemonList = await fetchPokemonList()

  const batch = pokemonList.slice(from - 1, to)

  const results: Array<PokemonDashboardData> = []

  // Process Pokémon in controlled batches
  for (let i = 0; i < batch.length; i += DASHBOARD_BATCH_SIZE) {
    const currentBatch = batch.slice(i, i + DASHBOARD_BATCH_SIZE)

    const batchResults = await Promise.all(
      currentBatch.map(async (pokemon) => {
        const [details, species] = await Promise.all([
          getPokemonById(pokemon.id),
          getPokemonSpeciesById(pokemon.id),
        ])

        return {
          id: pokemon.id,

          types: details.types.map(
            (type: { type: { name: string } }) => type.type.name,
          ),

          isLegendary: species.is_legendary,
        }
      }),
    )

    results.push(...batchResults)
  }

  return results
}
