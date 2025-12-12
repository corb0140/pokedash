import { useState } from 'react'
import { Menu } from 'lucide-react'
import NavModal from './Modals/NavModal'

export default function Navbar() {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className="py-3 px-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl">pokedash</h1>

      <Menu onClick={() => setShowModal(true)} />

      {showModal && <NavModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
