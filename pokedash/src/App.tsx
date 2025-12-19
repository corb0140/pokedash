import { useEffect, useState } from 'react'
import { Pause, Play, StepBack, StepForward } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import Footer from './components/Footer'
import { TYPE_COLORS } from './constants/typeColors'
import { usePokemonDetail } from './queries/usePokemonDetail'
import { getAllPokemonTypes, getPokemonTypeData } from './services/pokeAPI'
import { prefetchPokemonData } from '@/queries/getPokemonQuery'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { formatTime } from '@/utils/formatTime'

function App() {
  const [randomPokemon, setRandomPokemon] = useState(
    () => Math.floor(Math.random() * 1350) + 1,
  )
  const { data: pokemonData } = usePokemonDetail(randomPokemon)
  const [input, setInput] = useState<string>('')
  const [isGuessCorrect, setIsGuessCorrect] = useState<boolean>(false)
  const [types, setTypes] = useState<Array<string>>([])
  const [selectedType, setSelectedType] = useState('Normal')
  const [typeDamage, setTypeDamage] = useState<{
    strong: Array<string>
    weak: Array<string>
    immune: Array<string>
  }>({
    strong: [],
    weak: [],
    immune: [],
  })

  // AUDIO
  const {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setCurrentTrack,
  } = useAudioPlayer()

  useEffect(() => {
    prefetchPokemonData()
  }, [])

  // TYPE MATCH-UPS
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getAllPokemonTypes()

        const filtered = res.results
          .map((t: { name: string }) => t.name)
          .filter((t: string) => t !== 'unknown' && t !== 'stellar')

        setTypes(filtered)
      } catch (error) {
        console.error('Failed to fetch types', error)
      }
    }

    fetchTypes()
  }, [])

  useEffect(() => {
    if (!selectedType) return

    const fetchTypeDetails = async () => {
      const res = await getPokemonTypeData(selectedType)
      const data = res.damage_relations

      setTypeDamage({
        strong: [...data.double_damage_to.map((e: { name: string }) => e.name)],
        weak: [...data.double_damage_from.map((e: { name: string }) => e.name)],
        immune: [...data.no_damage_from.map((e: { name: string }) => e.name)],
      })
    }

    fetchTypeDetails()
  }, [selectedType])

  // GUESS GAME
  const handleGuessPokemon = (guess: string) => {
    if (pokemonData?.name.trim().toLowerCase() === guess.trim().toLowerCase()) {
      setIsGuessCorrect(true)
      setInput('')
    } else {
      setInput('')
    }
  }

  const resetGame = () => {
    setIsGuessCorrect(false)
    setInput('')
    setRandomPokemon(Math.floor(Math.random() * 1350) + 1)
  }

  return (
    <>
      <div className="flex flex-col py-6 px-10 lg:px-20 lg:py-10">
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

          <div className="bg-white w-full min-h-60 rounded-xl flex items-center justify-center text-xl p-4">
            <img
              src={pokemonData?.image}
              alt=""
              className={`h-1/2 w-1/2 object-contain transition-all duration-300 ${isGuessCorrect ? 'brightness-100' : 'brightness-0'}`}
            />
          </div>

          <input
            type="text"
            placeholder={isGuessCorrect ? 'End of Game' : 'Enter Pokémon Name'}
            className="border border-white text-white rounded-lg px-4 py-2 w-full text-center"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuessPokemon(input)}
            disabled={isGuessCorrect}
          />

          {/* BUTTONS */}
          {!isGuessCorrect ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleGuessPokemon(input)}
                className="px-6 py-2 text-info-text bg-white rounded-lg hover:scale-105 transition"
                disabled={isGuessCorrect}
              >
                Guess
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-2 text-info-text bg-white rounded-lg hover:scale-105 transition"
                disabled={isGuessCorrect}
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

          <p
            className={`${isGuessCorrect ? 'block' : 'hidden'} text-lg text-center text-info-text font-bold tracking-wider uppercase`}
          >
            {isGuessCorrect
              ? `It's ${pokemonData?.name}`
              : 'Wrong Guess, Try Again'}
          </p>
        </section>

        {/* MATCH-UPS */}
        <section className="mt-20 flex flex-col gap-6 ">
          <h2 className="text-2xl font-bold text-center">
            Type Matchups Trainer
          </h2>

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl grow capitalize ${
                  selectedType === type
                    ? `${TYPE_COLORS[type]} text-white`
                    : 'bg-white'
                } transition`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* DATA */}
          <div className="flex flex-col gap-2 mt-4 p-2 text-center">
            {[
              {
                title: 'Strong Against',
                typeDamage: typeDamage.strong.map((s: any, index) => (
                  <p
                    key={index}
                    className={`${TYPE_COLORS[s]} p-1.5 grow rounded-md`}
                  >
                    {s}
                  </p>
                )),
              },
              {
                title: 'Weak Against',
                typeDamage: typeDamage.weak.map((w: any, index) => (
                  <p
                    key={index}
                    className={`${TYPE_COLORS[w]} p-1.5 grow rounded-md`}
                  >
                    {w}
                  </p>
                )),
              },
              {
                title: 'Immune To',
                typeDamage:
                  typeDamage.immune.length > 0 ? (
                    typeDamage.immune.map((i: string) => (
                      <p
                        key={i}
                        className={`${TYPE_COLORS[i]} p-1.5 rounded-md grow`}
                      >
                        {i}
                      </p>
                    ))
                  ) : (
                    <p className="bg-link text-white p-1.5 rounded-md grow">
                      None
                    </p>
                  ),
              },
            ].map((data, index) => (
              <div key={index}>
                <h3 className="font-semibold">{data.title}</h3>
                <span
                  className={`mt-2 p-3 flex flex-wrap gap-2 text-white capitalize font-bold`}
                >
                  {data.typeDamage}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* MUSIC */}
        <section className="mt-15 bg-linear-to-r from-type-fire to-hp text-white rounded-2xl flex flex-col gap-6 py-4 px-3">
          <h2 className="text-2xl font-bold">Pokémon Music Player</h2>

          <div className="flex flex-col items-center gap-6 w-full">
            {/* CURRENT TRACK */}
            <p className="font-semibold text-lg w-full">
              {tracks[currentTrack].title}
            </p>

            {/* PROGRESS BAR */}
            <div className="w-full flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />

              <div className="flex justify-between text-sm opacity-80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="w-full flex gap-3">
              <button
                onClick={prevTrack}
                className="p-2 px-4 bg-white text-hp rounded-full"
              >
                <StepBack />
              </button>

              <button
                onClick={togglePlay}
                className="grow p-2 bg-white text-hp rounded-full flex justify-center"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 px-4 bg-white text-hp rounded-full"
              >
                <StepForward />
              </button>
            </div>
          </div>

          {/* TRACK LIST */}
          <div className="w-full mt-4 flex flex-col gap-2">
            {tracks.map((track, index) => (
              <button
                key={index}
                onClick={() => setCurrentTrack(index)}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  currentTrack === index
                    ? 'bg-white text-hp font-bold'
                    : 'bg-white/20 hover:cursor-pointer'
                }`}
              >
                {index + 1}. {track.title}
              </button>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

export default App
