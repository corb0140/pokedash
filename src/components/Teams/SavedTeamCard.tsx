import { Trash2 } from 'lucide-react'
import type { Team } from '@/db/teamsRepo'

function SavedTeamCard({
  team,
  onDelete,
}: {
  team: Team
  onDelete: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold capitalize truncate">{team.name}</h3>

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${team.name}`}
          className="text-hp shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {team.pokemon.map((member) => (
          <div
            key={member.id}
            className="aspect-square rounded-lg bg-page-background flex items-center justify-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="h-10 w-10 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedTeamCard
