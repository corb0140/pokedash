import { useEffect } from 'react'
import { prefetchPokemonData } from '@/queries/getPokemonQuery'

function App() {
  useEffect(() => {
    prefetchPokemonData()
  }, [])

  return <div className="flex flex-col mt-5 p-6"></div>
}

export default App
