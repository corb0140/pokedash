import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Loading({ text }: { text: string }) {
  const dots = ['.', '.', '.', '.']
  const dotsRef = useRef<Array<HTMLSpanElement>>([])

  useEffect(() => {
    gsap.fromTo(
      dotsRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        repeat: -1,
        stagger: 0.5,
        ease: 'power1.in',
      },
    )
  }, [dotsRef.current])

  return (
    <div className="w-full fixed top-[50%] flex items-end justify-center gap-0.5 font-semibold">
      <p className="uppercase bg-linear-to-r from-type-fire to-type-water bg-clip-text text-transparent">
        {text || 'Loading'}
      </p>

      <div className="uppercase bg-linear-to-r from-type-water to-type-grass bg-clip-text">
        {dots.map((dot, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) dotsRef.current[index] = el
            }}
            className="text-xl text-transparent"
          >
            {dot}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Loading
