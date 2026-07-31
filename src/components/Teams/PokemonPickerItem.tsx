import { useDraggable } from '@dnd-kit/core'
import type { TeamMember } from '@/db/teamsRepo'

function PokemonPickerItem({
  pokemon,
  inTeam,
  onSelect,
}: {
  pokemon: TeamMember
  inTeam: boolean
  onSelect: (pokemon: TeamMember) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `list-${pokemon.id}`,
    data: { source: 'list', pokemon },
    disabled: inTeam,
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={() => onSelect(pokemon)}
      disabled={inTeam}
      className={`aspect-square rounded-lg bg-page-background flex flex-col items-center justify-center gap-1 p-1 text-center cursor-grab touch-none transition-opacity
        ${inTeam ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}
        ${isDragging ? 'opacity-0' : ''}`}
    >
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="h-10 w-10 object-contain"
      />
      <span className="text-[11px] capitalize truncate w-full">
        {pokemon.name}
      </span>
    </button>
  )
}

export default PokemonPickerItem
