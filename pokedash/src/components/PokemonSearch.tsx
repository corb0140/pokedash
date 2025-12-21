import { useState } from 'react'

type PokemonSearchProps = {
  label: string
  pokemonList: Array<any>
  value: string
  onChange: (v: string) => void
  onSelect: (p: any) => void
}

export default function PokemonSearch({
  label,
  pokemonList,
  value,
  onChange,
  onSelect,
}: PokemonSearchProps) {
  const [isOpen, setIsOpen] = useState(false)

  const filtered =
    value.length > 0
      ? pokemonList.filter((p) =>
          p.name.toLowerCase().includes(value.toLowerCase()),
        )
      : []

  return (
    <div className="relative w-[clamp(150px,30vw,300px)]">
      <input
        type="text"
        placeholder={label}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        className="bg-white rounded-lg p-2 lg:p-3 w-full text-sm shadow-sm"
      />

      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white w-full rounded-lg shadow max-h-48 overflow-y-auto">
          {filtered.slice(0, 10).map((p) => (
            <li
              key={p.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer capitalize"
              onClick={() => {
                onSelect(p)
                setIsOpen(false)
              }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
