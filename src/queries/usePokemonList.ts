import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemonBatch, fetchPokemonList } from './getPokemonQuery'

const INITIAL_POKEMON_COUNT = 151
const BATCH_SIZE = 50

export function usePokemonList(from = 1, to = 1025) {
  return useInfiniteQuery({
    queryKey: ['pokemon-list', from, to],

    initialPageParam: from - 1,

    queryFn: async ({ pageParam }) => {
      const pokemonList = await fetchPokemonList()

      const startIndex = pageParam

      // First page loads 151.
      // Every page after that loads 50.
      const batchSize =
        startIndex === from - 1 ? INITIAL_POKEMON_COUNT : BATCH_SIZE

      const remainingPokemon = to - startIndex

      if (remainingPokemon <= 0) {
        return []
      }

      return fetchPokemonBatch(
        pokemonList,
        startIndex,
        Math.min(batchSize, remainingPokemon),
      )
    },

    getNextPageParam: (_lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (total, page) => total + page.length,
        0,
      )

      const nextIndex = from - 1 + loadedCount

      if (nextIndex >= to) {
        return undefined
      }

      return nextIndex
    },

    staleTime: 1000 * 60 * 60 * 24,
  })
}
