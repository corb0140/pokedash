import { Heart } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { pokemonIdRoute } from '@/routes/pokemonId'
import {
  useFavoritesMutations,
  useFavoritesQuery,
} from '@/queries/useFavoritesQuery'
import PokemonDetailsCard from '@/components/PokemonDetailsCard'

function PokemonDetails() {
  const router = useRouter()
  const { pokemonId } = pokemonIdRoute.useParams()
  const convertId = Number(pokemonId)
  const { data: favorites } = useFavoritesQuery()
  const { addFavorite, removeFavorite } = useFavoritesMutations()

  const isFavorited = favorites?.some(
    (f: { pokemon_id: number }) => f.pokemon_id === convertId,
  )

  return (
    <div className="p-6 lg:px-20 relative">
      <div className="flex justify-between top-2 w-full mb-10">
        {/* BACK BUTTON */}
        <button onClick={() => router.history.back()}>
          <span className="font-bold text-link">Back</span>
        </button>

        <button
          aria-label={
            isFavorited ? 'Remove from favorites' : 'Add to favorites'
          }
          onClick={() =>
            isFavorited
              ? removeFavorite.mutate(convertId)
              : addFavorite.mutate(convertId)
          }
        >
          {isFavorited ? (
            <Heart className="h-6 w-6 text-hp fill-hp" />
          ) : (
            <Heart className="h-6 w-6" />
          )}
        </button>
      </div>

      <PokemonDetailsCard
        selectedPokemonId={convertId}
        styles="relative h-full w-full"
        isVisible={true}
      />
    </div>
  )
}

export default PokemonDetails
