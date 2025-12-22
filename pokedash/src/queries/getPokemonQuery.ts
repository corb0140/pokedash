import { QueryClient } from '@tanstack/react-query'
import {
  getAllPokemon,
  getPokemonById,
  getPokemonSpeciesById,
  getPokemonTypeData,
} from '../services/pokeAPI'

export type PokemonProps = {
  id?: number
  image?: string
  name?: string
  order?: number
  types?: Array<string>
  abilities?: Array<string>
  weaknesses?: Array<string>
  isLegendary?: boolean
  isMythical?: boolean
}

export const queryClient = new QueryClient()

export async function fetchAllPokemon(
  from = 1,
  to = 1350,
): Promise<Array<PokemonProps>> {
  const list = await getAllPokemon()
  const batch = list.slice(from - 1, to)
  const results: Array<PokemonProps> = []
  const batchSize = 30

  for (let i = 0; i < batch.length; i += batchSize) {
    const slice = batch.slice(i, i + batchSize)

    const batchResult = await Promise.all(
      slice.map(async (item: any) => {
        const id = Number(item.url.split('/').at(-2))
        const res = await getPokemonById(id)

        // IS LEGENDARY
        let isLegendary = false

        try {
          const species = await getPokemonSpeciesById(id)
          isLegendary = species.is_legendary
        } catch (err) {
          console.warn(`Species fetch failed for Pokémon ${id}`)
        }

        // TYPES
        const types = res.types.map(
          (t: { type: { name: string } }) => t.type.name,
        )

        const typeResponses = await Promise.all(
          types.map(async (typeName: string) => {
            const typeData = await getPokemonTypeData(typeName)
            return typeData.damage_relations.double_damage_from.map(
              (t: { name: string }) => t.name,
            )
          }),
        )

        // WEAKNESSES
        const weaknesses = Array.from(new Set(typeResponses.flat()))

        return {
          id: res.id,
          image:
            res.sprites.other.showdown.front_default ||
            res.sprites.other.dream_world.front_default,
          name: res.name,
          order: res.order,
          types: types,
          abilities: res.abilities.map(
            (a: { ability: { name: string } }) => a.ability.name,
          ),
          weaknesses: weaknesses,
          isLegendary: isLegendary,
        }
      }),
    )
    results.push(...batchResult)
  }

  return results
}

export function prefetchPokemonData(from = 1, to = 1350) {
  return queryClient.prefetchQuery({
    queryKey: ['pokemon', from, to],
    queryFn: () => fetchAllPokemon(from, to),
    staleTime: 1000 * 60 * 60,
  })
}
