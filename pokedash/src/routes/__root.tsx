import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navbar from '@/components/Navbar'
import { useAuthQuery } from '@/queries/useAuthQuery'

export const rootRoute = createRootRoute({
  component: () => {
    const { isLoading, isError } = useAuthQuery()

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error loading user</div>

    return (
      <div>
        <div className="absolute -top-25 -left-25">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-80 w-80 lg:h-150 lg:w-150"
            viewBox="0 0 48 48"
          >
            <circle
              cx="23.99"
              cy="23.99"
              r="8"
              fill="none"
              stroke="hsl(220, 50%, 98%, 60%)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              fill="none"
              stroke="hsl(3, 88%, 64%, 50%)"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.83 27.75C4.6 37.83 13.4 45.49 23.99 45.49s19.39-7.66 21.16-17.74h-8.71c-1.61 5.35-6.58 9.24-12.45 9.24s-10.84-3.89-12.45-9.24zm-.01-7.5C4.59 10.16 13.4 2.49 23.99 2.49s19.4 7.67 21.17 17.76h-8.71c-1.61-5.36-6.58-9.26-12.46-9.26s-10.85 3.9-12.46 9.26z"
              strokeWidth="2"
            />
          </svg>
        </div>

        <header className="relative">
          <Navbar />
        </header>

        <main className="relative">
          <Outlet />
        </main>
      </div>
    )
  },
})
