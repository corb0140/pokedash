import type { PokemonProps } from '@/queries/getPokemonQuery'

export function filterPokemon(
  pokemon: Array<PokemonProps>,
  filters: {
    search: string
    type: string | null
    weakness: string | null
    ability: string | null
    sortAsc: boolean
  },
) {
  return pokemon
    .filter((p) => p.name?.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((p) => !filters.type || p.types?.includes(filters.type))
    .filter(
      (p) => !filters.weakness || p.weaknesses?.includes(filters.weakness),
    )
    .filter((p) => !filters.ability || p.abilities?.includes(filters.ability))
    .sort((a, b) => (filters.sortAsc ? a.id! - b.id! : b.id! - a.id!))
}
