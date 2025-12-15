import { useEffect, useState } from 'react'
import { Play, StepBack, StepForward } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import Footer from './components/Footer'
import { prefetchPokemonData } from '@/queries/getPokemonQuery'

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    prefetchPokemonData()
  }, [])

  return (
    <>
      <div className="flex flex-col p-6 lg:px-20 lg:py-10">
        {/* HERO */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="text-[clamp(2.5rem,5vw,6rem)] uppercase font-bold text-info-text">
              Explore the World of Pokémon
            </h1>

            <p className="text-link">
              Search, discover, and learn every Pokémon.
            </p>

            <div className="flex gap-4">
              <Link
                to="/pokedex"
                className="px-6 py-4 bg-hp text-white rounded-xl hover:bg-hp transition"
              >
                Open Pokedex
              </Link>

              <Link
                to="/dashboard"
                className="px-6 py-4 border border-link text-info-text rounded-xl hover:bg-gray-100 transition"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-64 w-64 animate-pokeball"
              viewBox="0 0 24 24"
            >
              <path
                fill="hsl(349, 74%, 50%)"
                d="M14.5 12a2.5 2.5 0 0 1-5 0a2.5 2.5 0 0 1 5 0m7.5 0c0 5.52-4.48 10-10 10S2 17.52 2 12S6.48 2 12 2s10 4.48 10 10m-2 0h-4c0-2.21-1.79-4-4-4s-4 1.79-4 4H4c0 4.41 3.59 8 8 8s8-3.59 8-8"
              />
            </svg>
          </div>
        </section>

        {/* GUESS THE POKEMON */}
        <section
          id="guess-pokemon"
          className="bg-hp mt-20 rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4"
        >
          <h2 className="text-2xl font-bold">Guess the Pokemon!</h2>

          <div className="bg-white w-full min-h-60 rounded-xl flex items-center justify-center text-xl">
            ?
          </div>
          <input
            type="text"
            placeholder="Enter Pokémon name"
            className="border border-white text-white rounded-lg px-4 py-2 w-full text-center"
          />
          <button className="px-6 py-2 text-info-text bg-white rounded-lg hover:scale-105 transition">
            Guess
          </button>
        </section>

        {/* MATCH-UPS */}
        <section className="mt-20 flex flex-col gap-6 ">
          <h2 className="text-2xl font-bold text-center">
            Type Matchups Trainer
          </h2>

          <div className="flex justify-center gap-4">
            {['Fire', 'Water', 'Grass'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl ${
                  selectedType === type
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-gray-300'
                } transition`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-4 p-2 text-center">
            <div>
              <h3 className="font-semibold">Strong Against</h3>
              <p className="mt-1 text-gray-600">Grass, Bug</p>
            </div>

            <div>
              <h3 className="font-semibold">Weak Against</h3>
              <p className="mt-1 text-gray-600">Water, Rock</p>
            </div>

            <div>
              <h3 className="font-semibold">Immune To</h3>
              <p className="mt-1 text-gray-600">None</p>
            </div>
          </div>
        </section>

        {/* MUSIC */}
        <section className="mt-15 bg-linear-to-r from-type-fire to-hp text-white rounded-2xl flex flex-col gap-6 py-4 px-3">
          <h2 className="text-2xl font-bold">Pokémon Music Player</h2>

          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full">
              <p className="font-semibold text-lg">current track</p>
            </div>

            <div className="w-full flex gap-3">
              <button
                // onClick={prevTrack}
                className="p-2 px-4 bg-white text-hp rounded-full"
              >
                <StepBack />
              </button>

              <button
                // onClick={togglePlay}
                className="grow p-2 bg-white text-hp rounded-full flex justify-center"
              >
                {isPlaying ? '❚❚' : <Play />}
              </button>

              <button
                // onClick={nextTrack}
                className="p-2 px-4 bg-white text-hp rounded-full"
              >
                <StepForward />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

export default App
