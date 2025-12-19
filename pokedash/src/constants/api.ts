export const ApiConstants = {
  API_URL: import.meta.env.VITE_API_URL,
}

export const ApiEndpoints = {
  ALL_POKEMON: 'pokemon?limit=10000&offset=0',
  GET_POKEMON_BY_ID: (id: number) => `pokemon/${id}`,
  GET_POKEMON_SPECIES_BY_ID: (id: number) => `pokemon-species/${id}`,
  GET_POKEMON_TYPE_DATA: (type: string) =>
    `https://pokeapi.co/api/v2/type/${type}`,
  GET_ALL_POKEMON_TYPES: 'https://pokeapi.co/api/v2/type',
}
