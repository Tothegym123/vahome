'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

type UserProfile = {
  mode: 'civilian' | 'military'
  selected_base: string | null
  work_address_1: string | null
  work_address_2: string | null
  work_lat_1: number | null
  work_lng_1: number | null
  work_lat_2: number | null
  work_lng_2: number | null
  onboarding_complete: boolean
}

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  profile: UserProfile | null
  profileLoading: boolean
  signOut: () => Promise<void>
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  authView: 'login' | 'register'
  setAuthView: (view: 'login' | 'register') => void
  showOnboarding: boolean
  setShowOnboarding: (show: boolean) => void
  refreshProfile: () => Promise<void>
  theme: 'bright' | 'dark'
  setTheme: (theme: 'bright' | 'dark') => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  profileLoading: true,
  signOut: async () => {},
  showAuthModal: false,
  setShowAuthModal: () => {},
  authView: 'login',
  setAuthView: () => {},
  showOnboarding: false,
  setShowOnboarding: () => {},
  refreshProfile: async () => {},
  theme: 'bright',
  setTheme: () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState<'login' | 'register'>('login')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [theme, setThemeState] = useState<'bright' | 'dark'>('bright')

  const supabase = createClient()

  // Load theme from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vahome-theme')
      if (saved === 'dark') setThemeState('dark')
    } catch {}
  }, [])

  const setTheme = (t: 'bright' | 'dark') => {
    setThemeState(t)
    try { localStorage.setItem('vahome-theme', t) } catch {}
  }

  const fetchProfile = async (userId: string) => {
    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        const newProfile: UserProfile = {
          mode: 'civilian',
          selected_base: null,
          work_address_1: null,
          work_address_2: null,
          work_lat_1: null,
          work_lng_1: null,
          work_lat_2: null,
          work_lng_2: null,
          onboarding_complete: false,
        }
        await supabase.from('user_profiles').insert({ id: userId, ...newProfile })
        setProfile(newProfile)
        setShowOnboarding(true)
      } else if (data) {
        setProfile(data as UserProfile)
        if (!data.onboarding_complete) {
          setShowOnboarding(true)
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
    }
    setProfileLoading(false)
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfileLoading(false)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session) {
        setShowAuthModal(false)
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setProfileLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, session, loading, profile, profileLoading,
      signOut, showAuthModal, setShowAuthModal,
      authView, setAuthView, showOnboarding, setShowOnboarding,
      refreshProfile, theme, setTheme,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
