import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './components/AuthProvider'
import FavoritesProvider from './components/FavoritesProvider'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('No se pudo registrar el service worker de Ritmavia:', error)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><AuthProvider><FavoritesProvider><App /></FavoritesProvider></AuthProvider></BrowserRouter></StrictMode>
)
