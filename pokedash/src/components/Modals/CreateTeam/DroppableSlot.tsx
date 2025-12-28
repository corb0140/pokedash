import { useDroppable } from '@dnd-kit/core'
import { Loader2 } from 'lucide-react'

function DroppableSlot({
  index,
  pokemon,
  onRemove,
}: {
  index: number
  pokemon?: any
  onRemove: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: index,
  })

  return (
    <div
      ref={setNodeRef}
      className={`aspect-square rounded-lg border border-dashed border-ability-border bg-page-background flex items-center justify-center relative
        ${isOver ? 'ring-2 ring-hp' : ''}`}
    >
      {pokemon ? (
        <>
          <img src={pokemon.image} alt={pokemon.name} className="h-12 w-12" />
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 text-xs text-hp"
          >
            ✕
          </button>
        </>
      ) : (
        <Loader2 className="animate-loader h-10 w-10 text-hp" />
      )}
    </div>
  )
}

export default DroppableSlot
