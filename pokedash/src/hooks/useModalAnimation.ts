import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useModalAnimation(onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.3 },
      )
    }
  }, [])

  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 100,
        duration: 0.3,
        onComplete: () => {
          onClose()
        },
      })
    }
  }

  return { modalRef, handleCloseModal }
}
