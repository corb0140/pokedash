import { Link } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import { navLinks } from '@/data/navLinks'

function Footer() {
  return (
    <div className="mt-15 min-h-100 bg-hp p-6">
      <h1 className="text-3xl text-center text-white">Pokedash</h1>

      <div className={`mt-10 flex flex-col items-center gap-3`}>
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className="w-full p-1 flex flex-col items-center text-white transition-colors duration-300"
          >
            <div className="flex gap-1 items-center">
              <Icon icon={link.icon} className="hidden h-5 w-5" />
              <p className="text-sm font-semibold font-orbitron">{link.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <span className="text-sm text-white text-center inline-block mt-10">
        <strong>@Disclaimer</strong> - All music is property of Nintendo, Games
        Freak and Creatures Inc, and is not intended for commercial use.
      </span>
    </div>
  )
}

export default Footer
