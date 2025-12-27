import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/restfulAPI'

/* ---------- API CALLS ---------- */

const addFavoriteRequest = async (pokemonId: number) => {
  const res = await api.post(`/favorites/${pokemonId}`)
  return res.data
}

const removeFavoriteRequest = async (pokemonId: number) => {
  const res = await api.delete(`/favorites/${pokemonId}`)
  return res.data
}

const getFavoritesRequest = async () => {
  const res = await api.get('/favorites')
  return res.data as Array<{
    pokemon_id: number
  }>
}

/* ---------- QUERY ---------- */

export const useFavoritesQuery = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesRequest,
  })
}

/* ---------- MUTATIONS ---------- */

export const useFavoritesMutations = () => {
  const queryClient = useQueryClient()

  const addFavorite = useMutation({
    mutationFn: addFavoriteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const removeFavorite = useMutation({
    mutationFn: removeFavoriteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return {
    addFavorite,
    removeFavorite,
  }
}
