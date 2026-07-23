import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/restfulAPI'

/* ---------- API CALLS ---------- */

const getTeamsRequest = async () => {
  const res = await api.get('/teams')
  return res.data as Array<{
    id: string
    name: string
    pokemon: Array<number>
  }>
}

const createTeamRequest = async (payload: {
  name: string
  pokemonIds: Array<number>
}) => {
  const res = await api.post('/teams', payload)
  return res.data
}

const deleteTeamRequest = async (teamId: string) => {
  const res = await api.delete(`/teams/${teamId}`)
  return res.data
}

/* ---------- QUERY ---------- */

export const useTeamsQuery = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getTeamsRequest,
  })
}

/* ---------- MUTATIONS ---------- */

export const useTeamsMutations = () => {
  const queryClient = useQueryClient()

  const createTeam = useMutation({
    mutationFn: createTeamRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })

  const deleteTeam = useMutation({
    mutationFn: deleteTeamRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })

  return {
    createTeam,
    deleteTeam,
  }
}
