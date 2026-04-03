'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { createClient } from '../lib/supabase/client'

interface FavoriteButtonProps {
  listingId: number
  listingData?: any
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function FavoriteButton({ listingId, listingData, size = 'md', className = '' }: FavoriteButtonProps) {
  const { user, setShowAuthModal, setAuthView } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sizeClasses = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-11 h-11' }
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }

  useEffect(() => {
    if (!user) {
      setIsFavorited(false)
      return
    }
    const supabase = createClient()
    const checkFavorite = async () => {
      const { data } = await supabase
        .from('saved_listings')
        .select('id')
        .eq('user_id', user.id)
        .eq('mls_number', listingId.toString())
        .maybeSingle()
      setIsFavorited(!!data)
    }
    checkFavorite()
  }, [user, listingId])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      setAuthView('register')
      setShowAuthModal(true)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      if (isFavorited) {
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('mls_number', listingId.toString())
        setIsFavorited(false)
      } else {
        await supabase
          .from('saved_listings')
          .insert({
            user_id: user.id,
            mls_number: listingId.toString(),
            listing_data: listingData || null,
          })
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-200 ${
        isFavorited
          ? 'bg-red-500 text-white shadow-md hover:bg-red-600'
          : 'bg-white/90 text-gray-500 shadow hover:bg-white hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'} ${className}`}
      title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
    >
      <svg
        className={iconSizes[size]}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
