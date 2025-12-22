type StatTileProps = {
  label: string
  value: number | string
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur p-4 shadow">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
