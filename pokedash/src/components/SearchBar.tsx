import { useEffect } from 'react'
import { Icon } from '@iconify/react'

export type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  useEffect(() => {
    return () => {
      onChange('')
    }
  }, [])

  return (
    <>
      <input
        type="text"
        className="p-5 lg:p-3 shadow-[4px_4px_15px_rgba(0,0,0,0.1)] w-full"
        placeholder="Search your pokemon!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="absolute right-4 flex items-center justify-center h-8 w-8 lg:h-6 lg:w-6 rounded-xl bg-active-link shadow-[0_0_20px_hsl(3,88%,64%)]">
        <Icon
          icon="mynaui:pokeball-solid"
          className="text-white h-4 w-4 lg:h-3 lg:w-3 relative"
        />
      </div>
    </>
  )
}

export default SearchBar
