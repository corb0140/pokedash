import { usePokemonDetail } from '@/queries/usePokemonDetail'

function PokemonCard({ pokemonId }: { pokemonId: number }) {
  const { data: pokemonDetail } = usePokemonDetail(pokemonId)

  return (
    <div className="p-4 rounded-lg bg-page-background flex items-center justify-center">
      <span className="text-sm flex flex-col items-center gap-2">
        <img
          src={pokemonDetail?.image}
          alt={`image of ${pokemonDetail?.name}`}
          className="h-10 w-10 object-contain"
        />
        <span className="text-center">
          <p>Nº{pokemonDetail?.id}</p>
          <p className="capitalize">{pokemonDetail?.name}</p>
        </span>
      </span>
    </div>
  )
}
export default PokemonCard
