import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type { TeamMember } from '@/db/teamsRepo'
import Loading from '@/components/Loading'
import HandleDeleteModal from '@/components/Modals/HandleDeleteModal'
import PokemonPickerItem from '@/components/Teams/PokemonPickerItem'
import SavedTeamCard from '@/components/Teams/SavedTeamCard'
import TeamSlot from '@/components/Teams/TeamSlot'

import { MAX_TEAMS, MAX_TEAM_SIZE } from '@/db/teamsRepo'
import { usePokemonSearchList } from '@/queries/usePokemonSearchList'
import { useTeamsMutations, useTeamsQuery } from '@/queries/useTeamsQuery'

type DragData =
  | { source: 'list'; pokemon: TeamMember }
  | { source: 'slot'; index: number }

function TeamBuilder() {
  const [search, setSearch] = useState('')
  const [teamName, setTeamName] = useState('')
  const [slots, setSlots] = useState<Array<TeamMember | null>>(
    Array(MAX_TEAM_SIZE).fill(null),
  )
  const [activeDrag, setActiveDrag] = useState<TeamMember | null>(null)
  const [teamPendingDelete, setTeamPendingDelete] = useState<string | null>(
    null,
  )

  const { data: pokemonList = [], isLoading: isPokemonListLoading } =
    usePokemonSearchList()

  const { data: teams = [], isLoading: isTeamsLoading } = useTeamsQuery()
  const { createTeam, deleteTeam } = useTeamsMutations()

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  )

  const filteredPokemon = pokemonList
    .filter((p) => p.id <= 1025)
    .map((p) => ({ ...p, name: p.name.replace(/-/g, ' ') }))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const inTeamIds = new Set(slots.filter((p) => p !== null).map((p) => p.id))
  const filledCount = slots.filter((p) => p !== null).length
  const teamIsFull = filledCount === MAX_TEAM_SIZE
  const maxTeamsReached = teams.length >= MAX_TEAMS

  function addPokemon(pokemon: TeamMember) {
    setSlots((prev) => {
      if (prev.some((p) => p?.id === pokemon.id)) return prev

      const emptyIndex = prev.findIndex((p) => p === null)
      if (emptyIndex === -1) return prev

      const next = [...prev]
      next[emptyIndex] = pokemon
      return next
    })
  }

  function removePokemon(index: number) {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DragData | undefined
    if (!data) return

    if (data.source === 'list') {
      setActiveDrag(data.pokemon)
    } else {
      setActiveDrag(slots[data.index])
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null)

    const { active, over } = event
    if (!over) return

    const activeData = active.data.current as DragData | undefined
    const overData = over.data.current as DragData | undefined

    if (!activeData || !overData || overData.source !== 'slot') return

    if (activeData.source === 'list') {
      const pokemon = activeData.pokemon

      setSlots((prev) => {
        if (prev.some((p) => p?.id === pokemon.id)) return prev

        const next = [...prev]
        next[overData.index] = pokemon
        return next
      })
    } else {
      const fromIndex = activeData.index
      const toIndex = overData.index
      if (fromIndex === toIndex) return

      setSlots((prev) => {
        const next = [...prev]
        ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
        return next
      })
    }
  }

  async function handleSave() {
    const pokemon = slots.filter((p): p is TeamMember => p !== null)
    if (pokemon.length !== MAX_TEAM_SIZE || !teamName.trim()) return

    await createTeam.mutateAsync({ name: teamName, pokemon })

    setSlots(Array(MAX_TEAM_SIZE).fill(null))
    setTeamName('')
  }

  if (isPokemonListLoading) {
    return <Loading text="Loading Pokemon Data" />
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 lg:px-20 lg:py-8 grid gap-8 mt-5">
        <h2 className="uppercase text-4xl lg:hidden">Team Builder</h2>

        {/* POKÉMON PICKER */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
          <div className="relative bg-page-background rounded-lg overflow-hidden flex items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pokemon to add..."
              className="p-3 w-full bg-transparent"
            />
          </div>

          <div className="h-64 lg:h-80 overflow-y-auto pr-1">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {filteredPokemon.map((pokemon) => (
                <PokemonPickerItem
                  key={pokemon.id}
                  pokemon={pokemon}
                  inTeam={inTeamIds.has(pokemon.id)}
                  onSelect={addPokemon}
                />
              ))}
            </div>

            {filteredPokemon.length === 0 && (
              <p className="text-center text-sm text-link/60 mt-8">
                No Pokémon found.
              </p>
            )}
          </div>
        </div>

        {/* TEAM BUILDER */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team name"
              maxLength={40}
              className="p-3 rounded-lg bg-page-background flex-1"
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={
                !teamIsFull ||
                !teamName.trim() ||
                maxTeamsReached ||
                createTeam.isPending
              }
              className="px-4 py-3 rounded-lg bg-active-link text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {createTeam.isPending ? 'Saving…' : 'Save Team'}
            </button>
          </div>

          {maxTeamsReached && (
            <p className="text-sm text-hp">
              You've reached the maximum of {MAX_TEAMS} saved teams. Delete a
              team to save a new one.
            </p>
          )}

          {createTeam.isError && (
            <p className="text-sm text-hp">
              {createTeam.error instanceof Error
                ? createTeam.error.message
                : 'Failed to save team.'}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:max-w-full gap-4 ">
            {slots.map((pokemon, index) => (
              <TeamSlot
                key={index}
                index={index}
                pokemon={pokemon}
                onRemove={() => removePokemon(index)}
              />
            ))}
          </div>
        </div>

        {/* SAVED TEAMS */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">
            Saved Teams ({teams.length}/{MAX_TEAMS})
          </h3>

          {isTeamsLoading ? (
            <p className="text-sm text-link/60">Loading teams…</p>
          ) : teams.length === 0 ? (
            <p className="text-sm text-link/60">
              You haven't saved any teams yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <SavedTeamCard
                  key={team.id}
                  team={team}
                  onDelete={() => setTeamPendingDelete(team.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeDrag && (
          <div className="aspect-square w-16 rounded-lg bg-page-background flex items-center justify-center shadow-lg">
            <img
              src={activeDrag.image}
              alt={activeDrag.name}
              className="h-10 w-10 object-contain"
            />
          </div>
        )}
      </DragOverlay>

      {teamPendingDelete && (
        <HandleDeleteModal
          title="Delete team"
          message="Are you sure you want to delete this team? This action cannot be undone."
          isDeleting={deleteTeam.isPending}
          onClose={() => setTeamPendingDelete(null)}
          onConfirm={async () => {
            await deleteTeam.mutateAsync(teamPendingDelete)
            setTeamPendingDelete(null)
          }}
        />
      )}
    </DndContext>
  )
}

export default TeamBuilder
