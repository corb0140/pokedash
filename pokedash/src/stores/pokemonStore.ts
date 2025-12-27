import { create } from 'zustand'

type PokemonStore = {
  selectedId: number | null
  isModalOpen: boolean

  filters: {
    type: string | null
    weakness: string | null
    ability: string | null
    search: string
    sortAsc: boolean
  }

  setSelectedId: (id: number | null) => void
  openModal: () => void
  closeModal: () => void
  setFilter: <T extends keyof PokemonStore['filters']>(
    key: T,
    value: PokemonStore['filters'][T],
  ) => void
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  selectedId: null,
  isModalOpen: false,

  filters: {
    type: null,
    weakness: null,
    ability: null,
    search: '',
    sortAsc: true,
  },

  setSelectedId: (id) => set({ selectedId: id }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}))
