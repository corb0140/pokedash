import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PokemonProps } from '@/queries/getPokemonQuery'
import { usePokemonStore } from '@/stores/pokemonStore'
import { usePokemonDetail } from '@/queries/usePokemonDetail'
import { TYPE_ICONS } from '@/constants/typeIcons'
import { STATS } from '@/constants/stats'
import { TYPE_COLORS } from '@/constants/typeColors'
import { getPokemonById } from '@/services/pokeAPI'

export type PokemonDetailModalProps = PokemonProps & {
  onClose?: () => void
}

export default function PokemonDetailModal({
  onClose,
  id,
}: PokemonDetailModalProps) {
  const { selectedId, setSelectedId } = usePokemonStore()
  const { data: pokemonData } = usePokemonDetail(selectedId)

  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<Array<HTMLSpanElement>>([])

  const closeText = [...'close']

  const [prevPokemon, setPrevPokemon] = useState<{
    name: string
    image: string
  } | null>(null)
  const [nextPokemon, setNextPokemon] = useState<{
    name: string
    image: string
  } | null>(null)

  // STOP SCROLL
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // ANIMATION
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { y: '100%' },
      { y: 0, duration: 0.5, ease: 'power1.in' },
    )

    gsap.fromTo(
      lettersRef.current,
      { rotationY: 0, opacity: 0 },
      {
        rotationY: 360,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out',
      },
    )
  }, [])

  // CLOSE FUNCTION
  const handleClose = () => {
    gsap.to(containerRef.current, {
      y: '100%',
      duration: 0.5,
      ease: 'power1.Out',
      onComplete: onClose,
    })
  }

  // FETCH NEXT & PREVIOUS POKEMON DATA
  useEffect(() => {
    async function fetchData() {
      if (!id) return

      try {
        if (id > 1) {
          const prev = await getPokemonById(id - 1)
          setPrevPokemon({
            name: prev.name,
            image: prev.sprites.other.showdown.front_default,
          })
        } else {
          setPrevPokemon(null)
        }

        if (id < 1350) {
          const next = await getPokemonById(id + 1)
          setNextPokemon({
            name: next.name,
            image: next.sprites.other.showdown.front_default,
          })
        } else {
          setNextPokemon(null)
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error)
      }
    }

    fetchData()
  }, [id])

  const handlePrev = () => {
    if (!selectedId) return
    if (selectedId > 1) setSelectedId(selectedId - 1)
  }

  const handleNext = () => {
    if (!selectedId) return
    if (selectedId < 1350) setSelectedId(selectedId + 1)
  }

  //   RERENDER ON LARGE SCREENS
  useEffect(() => {
    if (!id) return

    if (!selectedId) setSelectedId(id)
  }, [id])

  if (!pokemonData) return

  return (
    <div
      ref={containerRef}
      className={`fixed lg:relative h-[95vh] lg:h-[84vh] w-full bottom-0 left-0 bg-white overflow-y-scroll no-scrollbar rounded-t-2xl lg:rounded-b-2xl py-6 px-5 shadow-[-2px_0_10px_rgba(0,0,0,0.1)]`}
    >
      {/* CLOSE BUTTON */}
      <span
        onClick={handleClose}
        className="sticky top-5 left-100 text-lg lg:hidden"
      >
        {closeText.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            ref={(el) => {
              if (el) lettersRef.current[index] = el
            }}
            className="inline-block"
          >
            {letter}
          </span>
        ))}
      </span>

      {/* IMAGE */}
      <div className="h-40 w-full mt-15 lg:mt-5 mb-5">
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

            <div className="flex flex-wrap grow bg-page-background p-2 rounded-md items-center justify-center w-full">
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
                  <span className="">{s.baseStat}</span>
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
      <div className="mt-8 flex items-center justify-center h-20 w-full gap-6 bg-page-background rounded-lg">
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
    </div>
  )
}
