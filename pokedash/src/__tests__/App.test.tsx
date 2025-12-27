import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'
import type {} from '@tanstack/react-query'

// ---- MOCK ROUTER LINK ----
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ---- MOCK PREFETCH ----
vi.mock('@/queries/getPokemonQuery', () => ({
  prefetchPokemonData: vi.fn(),
}))

describe('App', () => {
  test('renders homepage content', () => {
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    )

    expect(screen.getByText(/explore the world of pokemon/i)).toBeDefined()
    expect(screen.getByText(/guess the pokemon/i)).toBeDefined()
  })
})
