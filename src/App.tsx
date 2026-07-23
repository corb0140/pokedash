import { Link } from '@tanstack/react-router'

function App() {
  return (
    <div className="max-h-screen overflow-hidden">
      <div className="flex flex-col p-6 lg:px-20 lg:py-6 2xl:py-15">
        {/* HERO */}
        <section className="lg:relative flex flex-col items-center justify-between gap-8 lg:gap-6">
          <div className="flex flex-col gap-6">
            <h1
              className="text-[clamp(2.5rem,5vw,4rem)] lg:max-w-250 2xl:max-w-300 uppercase font-bold text-info-text 
            lg:text-center"
            >
              Explore the World of Pokemon
            </h1>

            <p className="text-link lg-font-light lg:text-lg 2xl:text-2xl lg:text-center">
              Search, discover, and learn every Pokemon.
            </p>

            <div className="flex gap-4 lg:self-center">
              <Link
                to="/pokedex"
                className="lg:text-sm 2xl:text-lg px-5 md:px-5 py-3 md:py-4 bg-info-text text-white rounded-lg 
                hover:bg-hp hover:text-white transition-all duration-500 flex items-center
                hover:rounded-tl-none hover:rounded-br-none hover:scale-105"
              >
                Open Pokedex
              </Link>

              <Link
                to="/dashboard"
                className="lg:text-sm 2xl:text-lg px-5 md:px-6 py-3 md:py-5 border border-link text-info-text 
                rounded-lg hover:bg-hp hover:text-info-bg hover:border-transparent hover:rounded-tr-none 
                hover:rounded-bl-none transition-all duration-500 flex items-center hover:scale-105"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-64 w-64 2xl:h-80 2xl:w-80 animate-pokeball"
              viewBox="0 0 24 24"
            >
              <path
                fill="hsl(349, 74%, 50%)"
                d="M14.5 12a2.5 2.5 0 0 1-5 0a2.5 2.5 0 0 1 5 0m7.5 0c0 5.52-4.48 10-10 10S2 17.52 2 12S6.48 2 12 2s10 4.48 10 10m-2 0h-4c0-2.21-1.79-4-4-4s-4 1.79-4 4H4c0 4.41 3.59 8 8 8s8-3.59 8-8"
              />
            </svg>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
