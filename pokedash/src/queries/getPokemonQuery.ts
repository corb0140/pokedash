import { QueryClient, useQuery } from '@tanstack/react-query'
import { getAllPokemon, getPokemonById } from '../services/pokeAPI'

export type PokemonProps = {
  id?: number
  image?: string
  name?: string
  order?: number
  types?: Array<string>
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

        return {
          id: res.id,
          image:
            res.sprites.other.showdown.front_default ||
            res.sprites.other.dream_world.front_default,
          name: res.name,
          order: res.order,
          types: res.types.map((t: { type: { name: string } }) => t.type.name),
        }
      }),
    )
    results.push(...batchResult)
  }

  return results
}

export function usePokemonData(from = 1, to = 1350) {
  return useQuery<Array<PokemonProps>, Error>({
    queryKey: ['pokemon', from, to],
    queryFn: () => fetchAllPokemon(from, to),
    staleTime: 1000 * 60 * 5,
  })
}

export function prefetchPokemonData(from = 1, to = 1350) {
  return queryClient.prefetchQuery({
    queryKey: ['pokemon', from, to],
    queryFn: () => fetchAllPokemon(from, to),
  })
}
