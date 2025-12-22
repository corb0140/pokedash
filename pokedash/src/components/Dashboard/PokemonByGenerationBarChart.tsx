import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function PokemonGenerationBarChart({ data }: { data: Array<any> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(349, 74%, 50%, 50%)" />
            <stop offset="100%" stopColor="hsl(349, 74%, 50%)" />
          </linearGradient>
        </defs>

        <XAxis dataKey="generation" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
