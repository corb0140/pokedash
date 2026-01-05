type StatTileProps = {
  label: string
  value: number | string
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur p-4 shadow 2xl:flex 2xl:flex-col 2xl:items-center 2xl:justify-center 2xl:gap-6">
      <p className="text-sm 2xl:text-5xl text-muted-foreground">{label}</p>
      <p className="text-3xl 2xl:text-7xl font-bold">{value}</p>
    </div>
  )
}
