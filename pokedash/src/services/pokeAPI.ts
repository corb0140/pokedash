import axios from 'axios'
import { ApiConstants, ApiEndpoints } from '@/constants/api'

const { API_URL } = ApiConstants

const pokeApi = axios.create({
  baseURL: API_URL,
})

export async function getAllPokemon() {
  try {
    const res = await pokeApi.get(ApiEndpoints.ALL_POKEMON)
    return res.data.results
  } catch (error) {
    console.error('Error fetching pokemon: ', error)
  }
}

export async function getPokemonById(id: number) {
  try {
    const res = await pokeApi.get(ApiEndpoints.GET_POKEMON_BY_ID(id))
    return res.data
  } catch (error) {
    console.error('Error fetching pokemon: ', error)
  }
}

export async function getPokemonSpeciesById(id: number) {
  try {
    const res = await pokeApi.get(ApiEndpoints.GET_POKEMON_SPECIES_BY_ID(id))
    return res.data
  } catch (error) {
    console.error('Error fetching pokemon: ', error)
  }
}

export async function getPokemonTypeData(type: string) {
  try {
    const res = await pokeApi.get(ApiEndpoints.GET_POKEMON_TYPE_DATA(type))
    return res.data
  } catch (error) {
    console.error('Error fetching pokemon: ', error)
  }
}
