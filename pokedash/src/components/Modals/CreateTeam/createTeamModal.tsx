import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { Loader2, XIcon } from 'lucide-react'
import DraggablePokemon from './DraggablePokemon'
import DroppableSlot from './DroppableSlot'
import type { DragEndEvent } from '@dnd-kit/core'
import { usePokemonList } from '@/queries/usePokemonList'
import { useTeamsMutations } from '@/queries/useTeamsQuery'
import { useModalAnimation } from '@/hooks/useModalAnimation'
import SearchBar from '@/components/SearchBar'
import { usePokemonStore } from '@/stores/pokemonStore'
import { filterPokemon } from '@/utils/pokemonSelectors'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateTeamModal({ isOpen, onClose }: Props) {
  const { createTeam } = useTeamsMutations()
  const { data: pokemonData = [], isLoading } = usePokemonList(1, 1025)
  const [teamName, setTeamName] = useState('')
  const [slots, setSlots] = useState<Array<number | null>>(Array(6).fill(null))
  const { modalRef, handleCloseModal } = useModalAnimation(onClose)
  const canSubmit = teamName.trim().length > 0 && slots.every(Boolean)
  const { filters, setFilter } = usePokemonStore()
  const filteredPokemon = filterPokemon(pokemonData, filters)

  if (!isOpen) return null

  // DRAG AND DROP HANDLERS
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const pokemonId = Number(active.id)
    const slotIndex = Number(over.id)

    setSlots((prev) => {
      if (prev.includes(pokemonId)) return prev
      const updated = [...prev]
      updated[slotIndex] = pokemonId
      return updated
    })
  }

  const removePokemon = (index: number) => {
    setSlots((prev) => {
      const updated = [...prev]
      updated[index] = null
      return updated
    })
  }

  // SENSORS
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  )

  // SUBMIT HANDLER
  const handleCreate = () => {
    if (!canSubmit) return

    createTeam.mutate(
      {
        name: teamName,
        pokemonIds: slots as Array<number>,
      },
      {
        onSuccess: () => {
          setTeamName('')
          setSlots(Array(6).fill(null))
          handleCloseModal()
        },
      },
    )
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-page-background/70 backdrop-blur-sm"
    >
      <div className="bg-info-bg rounded-xl w-full max-w-4xl p-6 shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="uppercase text-2xl">Create Team</h2>
          <button onClick={handleCloseModal}>
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* TEAM NAME */}
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          className="w-full p-3 rounded-lg bg-page-background mb-6"
        />

        {isLoading ? (
          <div className="h-40 flex flex-col gap-3 items-center justify-center">
            <Loader2 className="animate-loader h-10 w-10 text-hp" />
            <p>Loading Pokemon</p>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {/* TEAM SLOTS */}
            <div className="grid grid-cols-6 gap-3 mb-6">
              {slots.map((pokemonId, index) => (
                <DroppableSlot
                  key={index}
                  index={index}
                  onRemove={() => removePokemon(index)}
                  pokemon={pokemonData.find((p) => p.id === pokemonId)}
                />
              ))}
            </div>

            {/* SEARCH BAR */}
            <div className="mb-6 lg:col-span-4 relative bg-white shadow-sm rounded-xl overflow-hidden flex items-center">
              <SearchBar
                value={filters.search}
                onChange={(value) => setFilter('search', value)}
              />
            </div>

            {/* POKEMON POOL */}
            <div className="max-h-72 overflow-y-auto no-scrollbar grid grid-cols-4 md:grid-cols-6 gap-3">
              {filteredPokemon.map((pokemon) => (
                <DraggablePokemon
                  key={pokemon.id}
                  pokemon={pokemon}
                  disabled={slots.includes(pokemon.id || null)}
                />
              ))}
            </div>
          </DndContext>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-link">
            {slots.filter(Boolean).length} / 6 selected
          </span>

          <button
            disabled={!canSubmit}
            onClick={handleCreate}
            className={`px-6 py-3 rounded-lg transition
              ${
                canSubmit
                  ? 'bg-hp text-white'
                  : 'bg-link text-white/50 cursor-not-allowed'
              }`}
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  )
}
