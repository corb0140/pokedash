import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import NavModal from './Modals/NavModal'
import { navLinks } from '@/data/navLinks'
import { useAuth } from '@/stores/auth'

export default function Navbar() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const user = useAuth.getState().user

  return (
    <div className="py-3 lg:py-4 px-4 lg:px-10 flex justify-between items-center shadow-sm bg-white mx-4 lg:mx-20 mt-5 rounded-xl">
      <h1 className="text-xl">pokedash</h1>

      <Menu onClick={() => setShowModal(true)} className="lg:hidden" />

      <div className={`hidden lg:flex gap-6 items-center`}>
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            activeOptions={{ exact: true }}
            inactiveProps={{ className: 'text-link' }}
            activeProps={{ className: `text-active-link` }}
            className="flex gap-2 items-center"
          >
            <Icon icon={link.icon} className={`h-8 w-8`} />
            <p className={`text-sm font-semibold`}>{link.name}</p>
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex">
        {!user ? (
          <Link to="/login" className="text-sm text-link font-semibold">
            Login
          </Link>
        ) : (
          <Link
            to="/profile-page"
            className="h-20 w-20 overflow-hidden rounded-full border border-link"
          />
        )}
      </div>

      {showModal && <NavModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
