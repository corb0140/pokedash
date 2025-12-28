import { useDraggable } from '@dnd-kit/core'

function DraggablePokemon({
  pokemon,
  disabled,
}: {
  pokemon: any
  disabled: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pokemon.id,
    disabled,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`aspect-square rounded-lg bg-page-background flex flex-col items-center justify-center text-xs cursor-grab
        ${disabled ? 'opacity-30 pointer-events-none' : ''}`}
    >
      <img src={pokemon.image} alt={pokemon.name} className="h-10 w-10" />
      <span className="mt-1 capitalize">{pokemon.name}</span>
    </div>
  )
}
export default DraggablePokemon
