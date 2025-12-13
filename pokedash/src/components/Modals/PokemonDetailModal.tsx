import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PokemonProps } from '@/queries/getPokemonQuery'
import { TYPE_ICONS } from '@/constants/typeIcons'
import { STATS } from '@/constants/stats'
import { TYPE_COLORS } from '@/constants/typeColors'
import {
  getPokemonById,
  getPokemonSpeciesById,
  getPokemonTypeData,
} from '@/services/pokeAPI'

export type PokemonDetailModalProps = PokemonProps & {
  onClose: () => void
}

export default function PokemonDetailModal({
  onClose,
  id,
}: PokemonDetailModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<Array<HTMLSpanElement>>([])

  const closeText = [...'close']
  const [name, setName] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  const [height, setHeight] = useState<number>()
  const [weight, setWeight] = useState<number>()
  const [baseXP, setBaseXP] = useState<number>()
  const [description, setDescription] = useState<string>('')
  const [types, setTypes] = useState<Array<string>>([])
  const [abilities, setAbilities] = useState<Array<string>>([])
  const [currentId, setCurrentId] = useState<number | undefined>(id)
  const [prevPokemon, setPrevPokemon] = useState<{
    name: string
    image: string
  } | null>(null)
  const [nextPokemon, setNextPokemon] = useState<{
    name: string
    image: string
  } | null>(null)

  const [stats, setStats] = useState<Array<{ name: string; baseStat: number }>>(
    [],
  )
  const [weaknesses, setWeaknesses] = useState<
    Array<{ type: string; multiplier: number }>
  >([])
  const [evolutionChain, setEvolutionChain] = useState<
    Array<{ name: string; image: string; minLevel?: number }>
  >([])

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

  // FETCH POKEMON DATA
  useEffect(() => {
    async function fetchData() {
      if (!currentId) return

      try {
        // FETCH POKEMON DATA
        const pokemon = await getPokemonById(currentId)

        setName(pokemon.name)
        setImage(pokemon.sprites.other.showdown.front_default)
        setHeight(pokemon.height)
        setWeight(pokemon.weight)
        setBaseXP(pokemon.base_experience)
        setStats(
          pokemon.stats.map((s: any) => ({
            name: s.stat.name,
            baseStat: s.base_stat,
          })),
        )
        setTypes(pokemon.types.map((t: any) => t.type.name))
        setAbilities(
          pokemon.abilities.map((a: any) => a.ability.name.replace('-', ' ')),
        )

        // FETCH GET POKEMON SPECIES
        const species = await getPokemonSpeciesById(currentId)

        // DESCRIPTION (FlAVOUR TEXT)
        const englishEntry = species.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en',
        )

        if (englishEntry) {
          const cleaned = englishEntry.flavor_text
            .replace(/\n/g, ' ') // remove line breaks
            .replace(/\f/g, ' ') // remove weird formatting char
            .trim()

          setDescription(cleaned)
        }

        // WEAKNESSES
        const pokemonTypes = pokemon.types.map(
          (t: { type: { name: string } }) => t.type.name,
        )

        const weaknessCount: { [key: string]: number } = {}

        for (const type of pokemonTypes) {
          const typeData = await getPokemonTypeData(type)
          typeData.damage_relations.double_damage_from.forEach((w: any) => {
            weaknessCount[w.name] = (weaknessCount[w.name] || 0) + 1
          })
        }
        setWeaknesses(
          Object.keys(weaknessCount).map((type) => ({
            type,
            multiplier: weaknessCount[type] === types.length ? 2 : 1,
          })),
        )

        // EVOLUTION CHAIN
        const evoChainData = await fetch(species.evolution_chain.url)
        const evoChainJson = await evoChainData.json()

        const evoArray: Array<{
          name: string
          image: string
          minLevel?: number
        }> = []

        let current = evoChainJson.chain
        let prevEvolutionDetails = null

        while (current) {
          const evoName = current.species.name
          const evoPokemon = await getPokemonById(evoName)

          const minLevel = prevEvolutionDetails?.min_level ?? undefined

          evoArray.push({
            name: evoName,
            image:
              evoPokemon.sprites.other['official-artwork'].front_default ??
              evoPokemon.sprites.front_default,
            minLevel,
          })

          prevEvolutionDetails =
            current.evolves_to[0]?.evolution_details?.[0] ?? null

          current = current.evolves_to[0]
        }

        setEvolutionChain(evoArray)

        // NEXT AND PREVIOUS SETTING IMAGES AND NAME
        if (currentId > 1) {
          const prev = await getPokemonById(currentId - 1)
          setPrevPokemon({
            name: prev.name,
            image: prev.sprites.other.showdown.front_default,
          })
        } else {
          setPrevPokemon(null)
        }

        if (currentId < 1350) {
          const next = await getPokemonById(currentId + 1)
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
  }, [currentId])

  const handlePrev = () => {
    if (!currentId) return
    if (currentId > 1) setCurrentId(currentId - 1)
  }

  const handleNext = () => {
    if (!currentId) return
    if (currentId < 1350) setCurrentId(currentId + 1)
  }

  return (
    <div
      ref={containerRef}
      className="fixed h-[95vh] w-full bottom-0 left-0 bg-white overflow-y-scroll no-scrollbar rounded-t-2xl py-6 px-5 shadow-[-2px_0_10px_rgba(0,0,0,0.1)]"
    >
      {/* CLOSE BUTTON */}
      <span onClick={handleClose} className="sticky top-5 left-100 text-lg">
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
      <div className="h-40 w-full mt-15 mb-5">
        <img
          src={image || undefined}
          alt={name}
          className="h-full w-full object-contain mx-auto mb-4"
        />
      </div>

      {/* NAME, TYPES, DESCRIPTION */}
      <div className="mt-5 flex flex-col gap-1 items-center text-sm">
        <p className="font-bold text-[18px] text-link">#{currentId}</p>

        {/* NAME */}
        <h2 className="text-2xl text-info-text font-bold capitalize">{name}</h2>

        {/* TYPES */}
        <div className="my-2 flex gap-3 flex-wrap justify-center text-sm">
          {types.map((t) => (
            <span
              key={t}
              className={`px-4 py-1.5 rounded-lg text-white uppercase font-bold text-[12px] ${TYPE_COLORS[t]}`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* DESCRIPTION */}
        <p>{description}</p>
      </div>

      {/* ABILITIES */}
      <div className="mt-5">
        <h3 className="font-semibold mb-2 text-info-text uppercase text-center tracking-widest">
          Abilities
        </h3>

        <div className="flex gap-3">
          {abilities.map((a, index) => (
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
          { title: 'height', data: height },
          { title: 'weight', data: weight },
          {
            title: 'weaknesses',
            data: weaknesses.map((w) => (
              <span key={w.type} className="relative">
                <img
                  src={TYPE_ICONS[w.type]}
                  alt={w.type}
                  className="h-7 w-7"
                />
              </span>
            )),
          },
          { title: 'baseXP', data: baseXP },
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
          {stats.map((s) => {
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
          {evolutionChain.map((evo, index) => (
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

              {index < evolutionChain.length - 1 && (
                <div className="flex flex-col items-center text-xs font-semibold text-link">
                  <span>Lv. {evolutionChain[index + 1].minLevel ?? '?'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PREVIOUS & NEXT */}
      <div className="mt-8 flex items-center justify-between h-20 w-full gap-3 bg-page-background rounded-lg">
        <button
          onClick={handlePrev}
          disabled={!prevPokemon}
          className="flex items-center gap-2 text-info-text rounded-lg disabled:opacity-50 grow"
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
                #{currentId && currentId - 1}
              </span>
            </>
          )}
        </button>

        <div className="border-r border-r-black/40 h-1/2"></div>

        <button
          onClick={handleNext}
          disabled={!nextPokemon}
          className="flex items-center gap-2 text-info-text rounded-lg disabled:opacity-50 grow"
        >
          {nextPokemon && (
            <>
              <span className="font-semibold text-sm">
                #{currentId && currentId + 1}
              </span>

              <span className="capitalize">{nextPokemon.name}</span>

              <img
                src={nextPokemon.image}
                alt={nextPokemon.name}
                className="h-8 w-8 object-contain"
              />
            </>
          )}
          {nextPokemon && <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
