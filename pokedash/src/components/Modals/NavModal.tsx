// import { Icon } from '@iconify-icon/react' {link.icon && <Icon icon={link.icon} />}
import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { navLinks } from '@/data/navLinks'
import { useAuth } from '@/stores/authStore'

function NavModal({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<Array<HTMLSpanElement>>([])
  const closeText = [...'close']
  const user = useAuth.getState().user

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power1.inOut',
      },
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

  const handleClose = () => {
    gsap.to(containerRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.5,
      ease: 'power1.inOut',
      onComplete: onClose,
    })
  }

  return (
    <div
      ref={containerRef}
      className="fixed top-0 p-5 right-0 min-h-screen w-1/2 bg-info-bg flex justify-center z-30"
    >
      <span onClick={handleClose} className="absolute top-5 right-5 text-lg">
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

      <div className="flex flex-col gap-4 p-2 items-center mt-30">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={handleClose}>
            {link.name}
          </Link>
        ))}

        <div className="mt-auto flex">
          {!user ? (
            <Link to="/login" onClick={handleClose}>
              Login
            </Link>
          ) : (
            <Link
              to="/profile-page"
              onClick={handleClose}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-15 w-15 overflow-hidden rounded-full border bg-active-link flex items-center justify-center text-3xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-lg font-semibold">{user.username}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavModal
