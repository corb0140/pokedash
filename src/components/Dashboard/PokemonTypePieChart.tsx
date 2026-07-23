import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { TYPE_RGB_COLORS } from '@/constants/typeColors'

export function PokemonTypePieChart({ data }: { data: Array<any> }) {
  return (
    <ResponsiveContainer width="100%" minHeight={350} height="90%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={110}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={TYPE_RGB_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
