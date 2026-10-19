let pending
export function loadYouTubePlayer() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (pending) return pending
  pending = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    const timer = setTimeout(() => {
      pending = null
      script.remove()
      reject(new Error('No se pudo cargar el reproductor de YouTube. Revisá tu conexión y recargá la página.'))
    }, 15000)
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer)
      if (typeof previous === 'function') previous()
      resolve(window.YT)
    }
    script.onerror = () => { clearTimeout(timer); pending = null; script.remove(); reject(new Error('No se pudo conectar con YouTube.')) }
    document.head.appendChild(script)
  })
  return pending
}
