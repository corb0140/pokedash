import { useQuery } from '@tanstack/react-query'
import { pokemonKeys } from './pokemonKeys'
import {
  getPokemonById,
  getPokemonSpeciesById,
  getPokemonTypeData,
} from '@/services/pokeAPI'

export function usePokemonDetail(id: number | null) {
  return useQuery({
    queryKey: pokemonKeys.detail(id!),
    enabled: !!id,
    queryFn: async () => {
      const pokemon = await getPokemonById(id!)
      const species = await getPokemonSpeciesById(id!)

      const types = pokemon.types.map((t: any) => t.type.name)

      //   WEAKNESSES
      const weaknesses = Array.from(
        new Set(
          (
            await Promise.all(
              types.map(async (type: string) => {
                const typeData = await getPokemonTypeData(type)
                return typeData.damage_relations.double_damage_from.map(
                  (t: { name: string }) => t.name,
                )
              }),
            )
          ).flat(),
        ),
      )

      //   EVOLUTION CHAIN
      const evoChainData = await fetch(species.evolution_chain.url)
      const evoChainJson = await evoChainData.json()

      const evoArray: Array<{
        name: string
        image: string
        minLevel?: number
      }> = []

      let current = evoChainJson.chain
      let prevEvolutionDetails = null

      while (current) {
        const evoName = current.species.name
        const evoPokemon = await getPokemonById(evoName)

        const minLevel = prevEvolutionDetails?.min_level ?? undefined

        evoArray.push({
          name: evoName,
          image:
            evoPokemon.sprites.other['official-artwork'].front_default ??
            evoPokemon.sprites.front_default,
          minLevel,
        })

        prevEvolutionDetails =
          current.evolves_to[0]?.evolution_details?.[0] ?? null

        current = current.evolves_to[0]
      }

      return {
        id: pokemon.id,
        name: pokemon.name,
        image:
          pokemon.sprites.other.showdown.front_default ||
          pokemon.sprites.other.dream_world.front_default,
        height: pokemon.height,
        weight: pokemon.weight,
        baseXP: pokemon.base_experience,
        stats: pokemon.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        types,
        abilities: pokemon.abilities.map((a: any) =>
          a.ability.name.replace('-', ' '),
        ),
        description:
          species.flavor_text_entries
            .find((e: any) => e.language.name === 'en')
            ?.flavor_text.replace(/\n|\f/g, ' ') ?? '',
        weaknesses,
        evolutionChain: evoArray,
      }
    },
  })
}
