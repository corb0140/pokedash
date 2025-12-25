import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { useAuthMutations } from '@/queries/useAuth'
import { usePokemonDetail } from '@/queries/usePokemonDetail'

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const { login } = useAuthMutations()
  const formRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  // GHOST POKEMON
  const { data: ghostData } = usePokemonDetail(93)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // HANDLE SUBMIT
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const payload = {
      identifier: formData.get('identifier') as string,
      password: formData.get('password') as string,
    }

    login.mutate(payload, {
      onSuccess: () => {
        formRef.current?.reset()
        navigate({ to: '/' })
      },
    })

    console.log('submitted')
  }

  return (
    <div className="p-6 lg:px-20 h-[calc(100vh-72px)] lg:h-[calc(100vh-86px)] flex flex-col justify-center items-center relative overflow-hidden">
      <h2 className="uppercase text-5xl self-start lg:self-center">Login</h2>

      <form
        action=""
        method="POST"
        onSubmit={handleSubmit}
        ref={formRef}
        className="w-full lg:w-1/3 mt-10 py-5 flex flex-col"
      >
        {/* USERNAME */}
        <div className="relative text-sm">
          <label
            htmlFor="identifier"
            className="absolute rounded-full bg-page-background -top-2.5 left-3 px-1.5"
          >
            Username or Email
          </label>
          <input
            type="text"
            name="identifier"
            id="identifier"
            className="p-3.5 w-full rounded-lg border bg-page-background"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative text-sm mt-5">
          <label
            htmlFor="password"
            className="absolute rounded-full bg-page-background -top-2.5 left-3 px-1.5"
          >
            Password
          </label>

          <input
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            id="password"
            className="p-3.5 w-full rounded-lg bg-page-background border"
          />

          <div
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-2.5 top-3.5"
          >
            {isPasswordVisible ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="self-start py-3 px-5 rounded-lg bg-hp text-white mt-10"
        >
          Login
        </button>

        {/* SIGNUP */}
        <span className="mx-auto mt-10">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold underline">
            signup
          </Link>
        </span>
      </form>

      {/* GHOST POKEMON */}
      {ghostData && (
        <img
          src={ghostData.image}
          alt="Haunter"
          className={`absolute top-5 lg:top-20 right-8 lg:right-50 -z-10 w-40 h-40 lg:h-75 lg:w-75  transition-opacity duration-2000 ${isVisible ? '' : 'opacity'}`}
        />
      )}
    </div>
  )
}

export default Login
