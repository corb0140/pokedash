import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { useAuthMutations } from '@/queries/useAuth'
import { usePokemonDetail } from '@/queries/usePokemonDetail'

function SignUp() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { signup } = useAuthMutations()
  const formRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  // GHOST POKEMON
  const { data: ghostData } = usePokemonDetail(429)
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
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    if (payload.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    signup.mutate(payload, {
      onSuccess: () => {
        formRef.current?.reset()

        navigate({ to: '/' })
      },
    })

    console.log('submitted')
  }
  return (
    <div className="p-6 lg:px-20 h-[calc(100vh-72px)] lg:h-[calc(100vh-86px)] flex flex-col justify-center items-center">
      <h2 className="uppercase text-5xl self-start lg:self-center">Sign Up</h2>

      <form
        ref={formRef}
        action=""
        method="POST"
        onSubmit={handleSubmit}
        className="w-full lg:w-1/3 mt-10 py-5 flex flex-col"
      >
        {/* USERNAME */}
        <div className="relative text-sm">
          <label
            htmlFor="username"
            className="absolute rounded-full bg-page-background -top-2.5 left-3 px-1.5"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="p-3.5 w-full rounded-lg bg-page-background border"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="relative text-sm mt-5">
          <label
            htmlFor="email"
            className="absolute rounded-full bg-page-background -top-2.5 left-3 px-1.5"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="p-3.5 w-full rounded-lg bg-page-background border"
            required
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
            required
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

        {/* ERROR */}
        {error && <p className="text-hp mt-4 text-sm">{error}</p>}

        {/* BUTTON */}
        <button
          type="submit"
          className="self-start py-3 px-5 rounded-lg bg-hp text-white mt-10"
        >
          Sign Up
        </button>

        {/* SIGNUP */}
        <span className="mx-auto mt-10">
          Already have an account?{' '}
          <Link to="/login" className="font-bold underline">
            login
          </Link>
        </span>
      </form>

      {/* GHOST POKEMON */}
      {ghostData && (
        <img
          src={ghostData.image}
          alt="Haunter"
          className={`absolute top-5 lg:top-20 right-8 lg:right-50 -z-10 w-40 h-40 lg:h-75 lg:w-75 transition-opacity duration-2000 ${isVisible ? '' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

export default SignUp
