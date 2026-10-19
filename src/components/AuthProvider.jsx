import { useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { supabase } from '../lib/supabase'
import { authError } from '../lib/authUtils'

export default function AuthProvider({ children }) {
  const [state, setState] = useState({ session: null, loading: Boolean(supabase), error: '' })
  const [recovery, setRecovery] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery')

  useEffect(() => {
    if (!supabase) return
    let alive = true
    let eventReceived = false
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      eventReceived = true
      if (!alive) return
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      if (event === 'SIGNED_OUT') setRecovery(false)
      setState({ session, loading: false, error: '' })
    })
    supabase.auth.getSession().then(({ data, error }) => {
      if (alive && !eventReceived) setState({ session: data.session, loading: false, error: error ? authError(error) : '' })
    }).catch(error => {
      if (alive && !eventReceived) setState({ session: null, loading: false, error: authError(error) })
    })
    return () => { alive = false; subscription.unsubscribe() }
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error
  }
  return <AuthContext.Provider value={{ ...state, user: state.session?.user || null, recovery, finishRecovery: () => setRecovery(false), signOut }}>{children}</AuthContext.Provider>
}
