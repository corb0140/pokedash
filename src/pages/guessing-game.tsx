import { useState } from 'react'
import { usePokemonDetail } from '@/queries/usePokemonDetail'

function GuessPokemon() {
  const MAX_POKEMON_ID = 1025

  const [randomPokemon, setRandomPokemon] = useState(
    () => Math.floor(Math.random() * MAX_POKEMON_ID) + 1,
  )

  const {
    data: pokemonData,
    isLoading,
    isError,
  } = usePokemonDetail(randomPokemon)

  const [input, setInput] = useState('')
  const [isGuessCorrect, setIsGuessCorrect] = useState(false)

  const handleGuessPokemon = (guess: string) => {
    if (
      pokemonData?.name.replace('-', ' ').trim().toLowerCase() ===
      guess.trim().toLowerCase()
    ) {
      setIsGuessCorrect(true)
      setInput('')
    } else {
      setInput('')
    }
  }

  const resetGame = () => {
    setIsGuessCorrect(false)
    setInput('')
    setRandomPokemon(Math.floor(Math.random() * MAX_POKEMON_ID) + 1)
  }

  return (
    <main className="min-h-screen p-6 lg:px-20 lg:py-10 flex flex-col items-center">
      <section className="bg-hp mt-10 rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4 w-full max-w-125">
        <h1 className="text-2xl font-bold">Guess the Pokémon!</h1>

        {isLoading && <p>Loading Pokémon...</p>}

        {isError && <p>Failed to load Pokémon.</p>}

        {pokemonData && (
          <div className="bg-white w-full min-h-60 rounded-xl flex items-center justify-center text-xl p-4">
            <img
              src={pokemonData.image}
              alt="Guess the Pokémon"
              className={`h-60 w-60 object-contain transition-all duration-300 ${
                isGuessCorrect ? 'brightness-100' : 'brightness-0'
              }`}
            />
          </div>
        )}

        <input
          type="text"
          placeholder={isGuessCorrect ? 'End of Game' : 'Enter Pokémon Name'}
          className="border border-white text-white rounded-lg px-4 py-2 w-full text-center"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleGuessPokemon(input)
            }
          }}
          disabled={isGuessCorrect}
        />

        {!isGuessCorrect ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleGuessPokemon(input)}
              className="px-6 py-2 text-info-text bg-white rounded-lg hover:scale-105 transition"
            >
              Guess
            </button>

            <button
              onClick={resetGame}
              className="px-6 py-2 text-info-text bg-white rounded-lg hover:scale-105 transition"
            >
              New Guess
            </button>
          </div>
        ) : (
          <button
            onClick={resetGame}
            className="px-6 py-2 text-info-text bg-white rounded-lg hover:scale-105 transition"
          >
            Reset Game
          </button>
        )}

        {isGuessCorrect && (
          <p className="text-lg text-center text-info-text font-bold tracking-wider uppercase">
            It's {pokemonData?.name.replace('-', ' ')}!
          </p>
        )}
      </section>
    </main>
  )
}

export default GuessPokemon
