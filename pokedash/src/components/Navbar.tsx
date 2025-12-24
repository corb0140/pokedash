import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import NavModal from './Modals/NavModal'
import { navLinks } from '@/data/navLinks'
import { useAuth } from '@/stores/authStore'

export default function Navbar() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const user = useAuth.getState().user

  return (
    <div className="py-3 lg:py-4.5 px-4 lg:px-10 flex justify-between items-center shadow-sm bg-white mx-4 lg:mx-20 mt-5 rounded-xl">
      <Link to="/">
        <h1 className="text-xl">pokedash</h1>
      </Link>

      <Menu onClick={() => setShowModal(true)} className="lg:hidden" />

      <div className={`hidden lg:flex gap-6 items-center`}>
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            activeOptions={{ exact: true }}
            inactiveProps={{
              className: 'text-link ',
            }}
            activeProps={{
              className: `text-active-link`,
            }}
            className="flex flex-col gap-2 items-center transition-colors duration-300"
          >
            <div className="flex gap-2 items-center">
              <Icon
                icon={link.icon}
                className="h-[clamp(1.1rem,2vw,2rem)] w-[clamp(1.1rem,2vw,2rem)]"
              />
              <p className="text-[clamp(0.7rem,1.1vw,0.875rem)] font-semibold font-orbitron">
                {link.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex">
        {!user ? (
          <Link
            to="/login"
            className="text-[clamp(0.7rem,.8vw,0.875rem)] text-link font-semibold font-orbitron"
          >
            Login
          </Link>
        ) : (
          <Link to="/profile-page" className="flex items-center gap-2">
            <div className="h-[clamp(1.5rem,2.5vw,3.5rem)] w-[clamp(1.5rem,2.5vw,3.5rem)] overflow-hidden rounded-full border bg-active-link flex items-center justify-center text-sm font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-[clamp(0.7rem,1vw,0.875rem)] font-semibold">
              {user.username}
            </span>
          </Link>
        )}
      </div>

      {showModal && <NavModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
