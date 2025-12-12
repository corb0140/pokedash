import { pokemonIdRoute } from '@/routes/pokemonId'

function PokemonDetails() {
  const { pokemonId } = pokemonIdRoute.useParams()
  const convertId = Number(pokemonId)
  return <div>{convertId}</div>
}

export default PokemonDetails
