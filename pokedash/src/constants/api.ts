export const ApiConstants = {
  API_URL: import.meta.env.VITE_API_URL,
}

export const ApiEndpoints = {
  ALL_POKEMON: 'pokemon?limit=10000&offset=0',
  GET_POKEMON_BY_ORDER_NUMBER: (id: number) => `pokemon/${id}`,
}
