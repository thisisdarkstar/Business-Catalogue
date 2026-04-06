import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const initialState = {
  favorites: [],
};

export const useFavStore = create<FavState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id]
        }));
      },
      isFavorite: (id: string) => get().favorites.includes(id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
