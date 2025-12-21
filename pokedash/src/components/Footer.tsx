import { Link } from '@tanstack/react-router'
import { navLinks } from '@/data/navLinks'

function Footer() {
  return (
    <div className="mt-15 min-h-100 lg:min-h-70 bg-hp p-6 flex flex-col">
      <h1 className="text-3xl lg:text-5xl text-center text-white">Pokedash</h1>

      <div
        className={`mt-10 flex flex-col lg:flex-row lg:justify-center items-center gap-3 lg:gap-6`}
      >
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="p-1 text-white transition-all duration-300 hover:scale-110"
          >
            <p className="text-sm font-semibold font-orbitron">{link.name}</p>
          </Link>
        ))}
      </div>

      <span className="text-sm text-white text-center inline-block mt-10 lg:mt-auto w-full">
        <strong>@Disclaimer</strong> - All music is property of Nintendo, Games
        Freak and Creatures Inc, and is not intended for commercial use.
      </span>
    </div>
  )
}

export default Footer
