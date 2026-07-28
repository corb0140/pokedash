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

const BATCH_SIZE = 50
const INITIAL_POKEMON_COUNT = 151

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
 * This only makes one API request.
 * No individual Pokémon detail requests
 * are made here.
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
 */
export async function fetchPokemonById(id: number): Promise<PokemonProps> {
  const [pokemon, species] = await Promise.all([
    getPokemonById(id),
    getPokemonSpeciesById(id),
  ])

  const types = pokemon.types.map(
    (t: { type: { name: string } }) => t.type.name,
  )

  const typeResponses = await Promise.all(
    types.map((type: string) =>
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
      pokemon.sprites.other?.showdown?.front_default ||
      pokemon.sprites.other?.dream_world?.front_default ||
      pokemon.sprites.front_default,
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
 * Fetch Pokémon in batches.
 *
 * The function yields each batch as soon as it finishes,
 * allowing the UI to progressively display Pokémon.
 */
export async function fetchPokemonBatch(
  pokemonList: Array<PokemonListItem>,
  startIndex: number,
  batchSize: number,
): Promise<Array<PokemonProps>> {
  const batch = pokemonList.slice(startIndex, startIndex + batchSize)

  return Promise.all(batch.map((pokemon) => fetchPokemonById(pokemon.id)))
}

/**
 * Fetch the initial 151 Pokémon.
 *
 * This should be called first so the UI can display
 * the original Pokémon while the rest load.
 */
export async function fetchInitialPokemon(): Promise<Array<PokemonProps>> {
  const pokemonList = await fetchPokemonList()

  return fetchPokemonBatch(pokemonList, 0, INITIAL_POKEMON_COUNT)
}

/**
 * Fetch the remaining Pokémon after the initial 151.
 *
 * This can be called in the background after
 * the first 151 Pokémon have been displayed.
 */
export async function fetchRemainingPokemon(): Promise<Array<PokemonProps>> {
  const pokemonList = await fetchPokemonList()

  const results: Array<PokemonProps> = []

  for (let i = INITIAL_POKEMON_COUNT; i < pokemonList.length; i += BATCH_SIZE) {
    const batchResults = await fetchPokemonBatch(pokemonList, i, BATCH_SIZE)

    results.push(...batchResults)
  }

  return results
}

export type PokemonDashboardData = {
  id: number
  types: Array<string>
  isLegendary: boolean
}

export async function fetchPokemonDashboardData(
  from = 1,
  to = 1025,
): Promise<Array<PokemonDashboardData>> {
  const pokemonList = await fetchPokemonList()

  const start = Math.max(1, from)
  const end = Math.min(to, pokemonList.length)

  const selectedPokemon = pokemonList.slice(start - 1, end)

  const results: Array<PokemonDashboardData> = []

  for (let i = 0; i < selectedPokemon.length; i += BATCH_SIZE) {
    const batch = selectedPokemon.slice(i, i + BATCH_SIZE)

    const batchResults = await Promise.all(
      batch.map(async (pokemon) => {
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
