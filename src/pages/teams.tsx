import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import { Loader2, PlusIcon, Trash2Icon } from 'lucide-react'
import { teamsRoute } from '@/routes/teams'
import { useTeamsMutations, useTeamsQuery } from '@/queries/useTeamsQuery'
import { CreateTeamModal } from '@/components/Modals/CreateTeam/createTeamModal'
import HandleDeleteModal from '@/components/Modals/HandleDeleteModal'
import PokemonCard from '@/components/PokemonCard'

export default function Teams() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const { isAuthenticated } = teamsRoute.useLoaderData()
  const { data: teams, isLoading } = useTeamsQuery()
  const { deleteTeam } = useTeamsMutations()
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)

  // AUTH REDIRECT
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate({
          to: '/login',
          search: { redirect: location.pathname },
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  // NOT AUTHENTICATED UI
  if (!isAuthenticated) {
    return (
      <div className="h-[85vh] flex items-center justify-center">
        <div className="text-lg font-medium flex flex-col items-center my-auto">
          <Icon icon="arcticons:pokemon-smile" className="mb-5 h-40 w-40" />
          <p>You must log in to view this page.</p>
          <p>Redirecting to login…</p>
        </div>
      </div>
    )
  }

  // LOADING UI
  if (isLoading) {
    return (
      <div className="h-[85vh] border flex flex-col gap-3 items-center justify-center">
        <Loader2 className="animate-loader h-10 w-10 text-hp" />
        <p>Loading Teams</p>
      </div>
    )
  }

  // DELETE TEAM LOGIC
  const handleDeleteTeam = (teamId: string) => {
    deleteTeam.mutate(teamId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false)
      },
    })
  }

  const teamCount = teams?.length ?? 0
  const canCreateTeam = teamCount < 10

  return (
    <div className="px-6 lg:px-20 py-10 min-h-[calc(100vh-86px)]">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl uppercase tracking-wide">My Teams</h1>
          <p className="lg:text-sm text-link mt-3">
            {teamCount} / 10 teams • 6 Pokemon per team
          </p>
        </div>

        <button
          disabled={!canCreateTeam}
          onClick={() => setIsCreateModalOpen(true)}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow transition
            ${
              canCreateTeam
                ? 'bg-hp text-white hover:scale-[1.02]'
                : 'bg-link text-white/60 cursor-not-allowed'
            }`}
        >
          <PlusIcon className="h-5 w-5" />
          Create Team
        </button>
      </div>

      {/* EMPTY STATE */}
      {teamCount === 0 && (
        <div className="mt-20 flex flex-col items-center text-center">
          <Icon icon="mdi:pokeball-outline" className="h-20 w-20 text-link" />
          <p className="mt-6 font-bold uppercase">No teams yet</p>
          <p className="text-sm text-link mt-2">
            Build your first Pokemon team to get started
          </p>
        </div>
      )}

      {/* TEAMS GRID */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams?.map((team) => (
          <div
            key={team.id}
            className="bg-info-bg rounded-xl p-5 shadow-md hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="uppercase tracking-wide text-lg">{team.name}</h3>

              <button
                onClick={() => {
                  setTeamToDelete(team.id)
                  setIsDeleteModalOpen(true)
                }}
                className="text-hp hover:scale-110 transition"
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>

            {/* POKEMON GRID */}
            <div className="grid grid-cols-3 gap-3">
              {team.pokemon.map((pokemon_id) => (
                <PokemonCard key={pokemon_id} pokemonId={pokemon_id} />
              ))}
            </div>
          </div>
        ))}

        {/* CREATE TEAM CARD */}
        {canCreateTeam && (
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-ability-border rounded-xl flex flex-col items-center justify-center text-center p-6 hover:bg-info-bg transition cursor-pointer"
          >
            <Icon icon="mdi:pokeball-plus" className="h-12 w-12 text-hp mb-4" />
            <p className="font-bold uppercase">Create New Team</p>
            <p className="text-xs text-link mt-2">
              {teamCount} / 10 teams used
            </p>
          </div>
        )}

        {/* TOGGLE CREATE TEAM MODAL */}
        {isCreateModalOpen && (
          <CreateTeamModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}

        {/* TOGGLE DELETE TEAM MODAL */}
        {isDeleteModalOpen && (
          <HandleDeleteModal
            isDeleting={deleteTeam.isPending}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              if (teamToDelete) {
                handleDeleteTeam(teamToDelete)
                setTeamToDelete(null)
              }
            }}
            title="Delete Team"
            message="Are you sure you want to delete this team? This action cannot be undone."
          />
        )}
      </div>
    </div>
  )
}
