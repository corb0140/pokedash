import { useEffect, useState } from 'react'
import { getPokemonById } from '@/services/pokeAPI'

export function usePokemonNextPrev(
  selectedId: number | null,
  setSelectedId: (id: number | null) => void,
) {
  const [prevPokemon, setPrevPokemon] = useState<{
    name: string
    image: string
  } | null>(null)

  const [nextPokemon, setNextPokemon] = useState<{
    name: string
    image: string
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!selectedId) return

      try {
        if (selectedId > 1) {
          const prev = await getPokemonById(selectedId - 1)
          setPrevPokemon({
            name: prev.name,
            image: prev.sprites.other.showdown.front_default,
          })
        } else {
          setPrevPokemon(null)
        }

        if (selectedId < 1350) {
          const next = await getPokemonById(selectedId + 1)
          setNextPokemon({
            name: next.name,
            image: next.sprites.other.showdown.front_default,
          })
        } else {
          setNextPokemon(null)
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error)
      }
    }

    fetchData()
  }, [selectedId])

  const handlePrev = () => {
    if (!selectedId) return
    if (selectedId > 1) setSelectedId(selectedId - 1)
  }

  const handleNext = () => {
    if (!selectedId) return
    if (selectedId < 1350) setSelectedId(selectedId + 1)
  }

  return { prevPokemon, handlePrev, nextPokemon, handleNext }
}
