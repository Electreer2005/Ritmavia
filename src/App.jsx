import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Player from './components/Player/Player'
import Home from './pages/Home/Home'
import Search from './pages/Search/Search'
import Library from './pages/Library/Library'
import Album from './pages/Album/Album'
import Profile from './pages/Profile/Profile'
import Favorites from './pages/Favorites/Favorites'
import NotFound from './pages/NotFound/NotFound'
import { useFavorites } from './hooks/useFavorites'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Callback from './pages/Auth/Callback'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import './App.css'

export default function App() {
  const { saveError } = useFavorites()
  const { recovery, user } = useAuth()
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  if (recovery && user && pathname !== '/restablecer') return <Navigate to="/restablecer" replace />
  return (
    <div className="app">
      <Sidebar />
      <main id="contenido">
        <Header />
        <div className="content">
          <VideoPlayer />
          {saveError && <p role="status">{saveError}</p>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/biblioteca" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/album/:albumId" element={<Album />} />
            <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/favoritos" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar" element={<ForgotPassword />} />
            <Route path="/restablecer" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Player />
    </div>
  )
}
