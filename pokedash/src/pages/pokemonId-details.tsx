import { pokemonIdRoute } from '@/routes/pokemonId'

function PokemonDetails() {
  const { pokemonId } = pokemonIdRoute.useParams()
  return <div>{pokemonId}</div>
}

export default PokemonDetails
