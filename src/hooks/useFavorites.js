import { useContext } from 'react'
import { FavoritesContext } from '../store/favoritesContext'
export function useFavorites() {
  return useContext(FavoritesContext)
}
