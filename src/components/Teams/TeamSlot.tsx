import { useDraggable, useDroppable } from '@dnd-kit/core'
import { X } from 'lucide-react'
import type { TeamMember } from '@/db/teamsRepo'

function TeamSlot({
  index,
  pokemon,
  onRemove,
}: {
  index: number
  pokemon: TeamMember | null
  onRemove: () => void
}) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { source: 'slot', index },
  })

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `slot-${index}`,
    data: { source: 'slot', index },
    disabled: !pokemon,
  })

  return (
    <div
      ref={(node) => {
        setDropRef(node)
        setDragRef(node)
      }}
      className={`aspect-square rounded-lg border-2 border-dashed border-ability-border bg-page-background flex items-center justify-center relative touch-none
        ${isOver ? 'ring-2 ring-hp border-hp' : ''}
        ${isDragging ? 'opacity-30' : ''}`}
    >
      {pokemon ? (
        <>
          <div
            {...listeners}
            {...attributes}
            className="flex flex-col items-center gap-1 cursor-grab w-full h-full justify-center"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="h-12 w-12 lg:h-14 lg:w-14 object-contain"
            />
            <span className="text-xs capitalize">{pokemon.name}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-hp text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <span className="text-xs text-link/50">Empty</span>
      )}
    </div>
  )
}

export default TeamSlot
