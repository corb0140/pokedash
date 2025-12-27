import { useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { usePokemonStore } from '@/stores/pokemonStore'
import { usePokemonDetail } from '@/queries/usePokemonDetail'
import { TYPE_ICONS } from '@/constants/typeIcons'
import { STATS } from '@/constants/stats'
import { TYPE_COLORS } from '@/constants/typeColors'
import { usePokemonNextPrev } from '@/hooks/usePokemonNextPrev'

export default function PokemonDetailsCard({
  styles,
  isVisible,
  selectedPokemonId,
}: {
  styles?: string
  isVisible?: boolean
  selectedPokemonId?: number
}) {
  const { selectedId, setSelectedId } = usePokemonStore()
  const pokemonIdToUse = selectedId ?? selectedPokemonId
  const { data: pokemonData } = usePokemonDetail(pokemonIdToUse || null)
  const { prevPokemon, handlePrev, nextPokemon, handleNext } =
    usePokemonNextPrev(pokemonIdToUse || null, setSelectedId)

  useEffect(() => {
    if (pokemonIdToUse && pokemonIdToUse !== selectedId) {
      setSelectedId(pokemonIdToUse)
    }
  }, [pokemonIdToUse, selectedId, setSelectedId])

  if (!pokemonData) return

  return (
    <div className={styles}>
      {/* IMAGE */}
      <div className="h-40 w-full mt-5 mb-5">
        <img
          src={pokemonData.image}
          alt={pokemonData.name}
          className="h-full w-full object-contain mx-auto mb-4"
        />
      </div>

      {/* NAME, TYPES, DESCRIPTION */}
      <div className="mt-5 flex flex-col gap-1 items-center text-sm">
        <p className="font-bold text-[18px] text-link">#{selectedId}</p>

        {/* NAME */}
        <h2 className="text-2xl text-info-text font-bold capitalize">
          {pokemonData.name}
        </h2>

        {/* TYPES */}
        <div className="my-2 flex gap-3 flex-wrap justify-center text-sm">
          {pokemonData.types.map((t: any) => (
            <span
              key={t}
              className={`p-2 rounded-lg text-white uppercase font-bold text-[12px] ${TYPE_COLORS[t]}`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* DESCRIPTION */}
        <p className="text-center">{pokemonData.description}</p>
      </div>

      {/* ABILITIES */}
      <div className="mt-5">
        <h3 className="font-semibold mb-2 text-info-text uppercase text-center tracking-widest">
          Abilities
        </h3>

        <div className="flex gap-3">
          {pokemonData.abilities.map((a: any, index: number) => (
            <span
              key={a}
              className={`capitalize font-bold grow bg-page-background px-5 py-1.5 border rounded-lg text-sm ${index === 0 ? 'border-link' : 'border-ability-border'}`}
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* GRID - HEIGHT, BASE, WEIGHT, WEAKNESS */}
      <div className="mt-5 grid grid-cols-2 grid-rows-2 gap-4">
        {[
          { title: 'height', data: pokemonData.height },
          { title: 'weight', data: pokemonData.weight },
          {
            title: 'weaknesses',
            data: pokemonData.weaknesses.map((w) => (
              <span key={w} className="relative">
                <img src={TYPE_ICONS[w]} alt={w} className="h-7 w-7" />
              </span>
            )),
          },
          { title: 'baseXP', data: pokemonData.baseXP },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <h3 className="uppercase tracking-widest text-info-text text-sm flex">
              {item.title}
            </h3>

            <div
              className={`flex flex-wrap grow ${isVisible ? 'bg-white' : 'bg-page-background'} p-2 rounded-md items-center justify-center w-full`}
            >
              {item.data}
              {item.title === 'height' ? 'm' : item.title === 'weight' && 'kg'}
            </div>
          </div>
        ))}
      </div>

      {/* STATS */}
      <div className="mt-5">
        <h3 className="font-semibold mb-2">Stats</h3>

        <div className="flex gap-3">
          {pokemonData.stats.map((s: any) => {
            const stat = STATS[s.name]

            return (
              <div key={s.name} className="flex items-center gap-3 w-full">
                <div className="flex flex-col items-center gap-4 text-sm font-bold grow">
                  {/* LABEL */}
                  <div
                    className={`h-10 w-10 flex items-center justify-center rounded-full ${stat.color}`}
                  >
                    <span className="text-xs text-white">{stat.label}</span>
                  </div>

                  {/* VALUE */}
                  <span className="">{s.value}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* EVOLUTION CHAIN */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Evolution Chain</h3>

        <div className="flex items-center justify-center gap-4">
          {pokemonData.evolutionChain.map((evo: any, index: number) => (
            <div key={evo.name} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <img
                  src={evo.image}
                  alt={evo.name}
                  className="h-20 w-20 object-contain"
                />

                <span className="capitalize text-sm font-semibold">
                  {evo.name}
                </span>
              </div>

              {index < pokemonData.evolutionChain.length - 1 && (
                <div className="flex flex-col items-center text-xs font-semibold text-link">
                  <span>
                    Lv. {pokemonData.evolutionChain[index + 1].minLevel ?? '?'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PREVIOUS & NEXT */}
      {!isVisible && (
        <div className="mt-8 flex items-center justify-center h-20 w-full gap-6 rounded-lg bg-page-background">
          <button
            onClick={handlePrev}
            disabled={!prevPokemon}
            className="flex items-center gap-2 text-info-text rounded-lg disabled:opacity-50"
          >
            {prevPokemon && <ChevronLeft className="h-5 w-5" />}

            {prevPokemon && (
              <>
                <img
                  src={prevPokemon.image}
                  alt={prevPokemon.name}
                  className="h-5 w-5 object-contain"
                />

                <span className="capitalize">{prevPokemon.name}</span>

                <span className="font-semibold text-sm">
                  #{selectedId && selectedId - 1}
                </span>
              </>
            )}
          </button>

          <div className="border-r border-r-black/40 h-1/2"></div>

          <button
            onClick={handleNext}
            disabled={!nextPokemon}
            className="flex items-center gap-2 text-info-text rounded-lg disabled:opacity-50"
          >
            {nextPokemon && (
              <>
                <span className="font-semibold text-sm">
                  #{selectedId && selectedId + 1}
                </span>

                <span className="capitalize">{nextPokemon.name}</span>

                <img
                  src={nextPokemon.image}
                  alt={nextPokemon.name}
                  className="h-5 w-5 object-contain"
                />
              </>
            )}
            {nextPokemon && <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* LINK TO POKEMON DETAILS PAGE */}
      {selectedId && !isVisible && (
        <div className="w-full flex">
          <Link
            className="inline-flex mx-auto mt-5 py-2.5 px-6 bg-info-text text-white rounded-lg text-sm"
            to="/$pokemonId"
            params={{ pokemonId: String(selectedId) }}
          >
            View More Details
          </Link>
        </div>
      )}

      {/* POKEMON DETAILS PAGE CONTENT */}
      {isVisible && (
        <div className="mt-5 flex flex-col gap-6">
          {/* CATCH RATE */}
          <div>
            <h3 className="font-semibold mb-2">Catch Rate</h3>
            <p className="capitalize text-info-text lg:text-sm">
              {pokemonData.catchRate}%
            </p>
          </div>

          {/* MOVES */}
          <div>
            <h3 className="font-semibold mb-2">Moves</h3>

            <div className="max-h-80 w-fit overflow-y-scroll py-2 rounded-lg flex flex-wrap gap-2">
              {pokemonData.moves.map((move: string, index: number) => (
                <span
                  key={index}
                  className="capitalize text-info-text lg:text-sm"
                >
                  {move.replace('-', ' ')},
                </span>
              ))}
            </div>
          </div>

          {/* LOCATIONS */}
          <div>
            <h3 className="font-semibold mb-2">Locations</h3>
            {pokemonData.locations.length > 0 ? (
              <p className="capitalize text-info-text lg:text-sm">
                {pokemonData.locations.join(', ')}
              </p>
            ) : (
              <p className="lg:text-sm">No locations available.</p>
            )}
          </div>

          {/* SHINY */}
          <div>
            <h3 className="font-semibold mb-2">Shiny Version</h3>

            <img
              src={pokemonData.shiny}
              alt={`Shiny version of ${pokemonData.name}`}
              className="h-40 w-40 object-contain mx-auto"
            />
          </div>

          {/* CRIES */}
          <div>
            <h3 className="font-semibold mb-2">Cry</h3>

            {pokemonData.cries ? (
              <audio controls className="border rounded-md">
                <source src={pokemonData.cries} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="lg:text-sm">No cry available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
