import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Team, TeamMember } from '@/db/teamsRepo'
import * as teamsRepo from '@/db/teamsRepo'

export type { Team, TeamMember }

/* ---------- QUERY ---------- */

export const useTeamsQuery = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsRepo.getAllTeams,
  })
}

/* ---------- MUTATIONS ---------- */

export const useTeamsMutations = () => {
  const queryClient = useQueryClient()

  const createTeam = useMutation({
    mutationFn: (payload: { name: string; pokemon: Array<TeamMember> }) =>
      teamsRepo.createTeam(payload.name, payload.pokemon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })

  const deleteTeam = useMutation({
    mutationFn: (teamId: string) => teamsRepo.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })

  return {
    createTeam,
    deleteTeam,
  }
}
