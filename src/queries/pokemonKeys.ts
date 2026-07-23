export const pokemonKeys = {
  all: ['pokemon'] as const,
  list: (from: number, to: number) => [...pokemonKeys.all, from, to],
  detail: (id: number) => [...pokemonKeys.all, id],
}
