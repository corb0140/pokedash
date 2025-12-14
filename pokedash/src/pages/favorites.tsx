import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import { favoritesRoute } from '@/routes/favorites'

export default function Favorites() {
  const navigate = useNavigate()
  const { isAuthenticated } = favoritesRoute.useLoaderData()

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate({
          to: '/login',
          search: { redirect: location.pathname },
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="h-[85vh] flex items-center justify-center">
        <div className="text-lg font-medium flex flex-col items-center my-auto">
          <Icon icon="arcticons:pokemon-smile" className="mb-5 h-40 w-40" />

          <p>You must log in to view this page.</p>
          <p>Redirecting to login…</p>
        </div>
      </div>
    )
  }

  return <>{/* Actual favorites page */}</>
}
