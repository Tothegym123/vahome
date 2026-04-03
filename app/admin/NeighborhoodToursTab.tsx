'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createClient } from '../lib/supabase/client'

type NeighborhoodTour = {
  id: string
  title: string
  description: string | null
  youtube_url: string
  lat: number
  lng: number
  created_at: string
}

export default function NeighborhoodToursTab() {
  const supabase = createClient()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [tours, setTours] = useState<NeighborhoodTour[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [pinLat, setPinLat] = useState<number | null>(null)
  const [pinLng, setPinLng] = useState<number | null>(null)

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null)

  // Fetch tours from Supabase
  const fetchTours = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('neighborhood_tours')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setTours(data)
    if (error) console.error('Error fetching tours:', error)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    let cancelled = false

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default

      if (cancelled || !mapContainerRef.current) return

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-76.15, 36.85],
        zoom: 10
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
        if (!cancelled) setMapLoaded(true)
      })

      // Click to drop pin
      map.on('click', (e: any) => {
        const { lng, lat } = e.lngLat

        setPinLat(Math.round(lat * 1000000) / 1000000)
        setPinLng(Math.round(lng * 1000000) / 1000000)

        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove()
        }

        // Create new draggable marker
        const marker = new mapboxgl.Marker({
          color: '#EF4444',
          draggable: true
        })
          .setLngLat([lng, lat])
          .addTo(map)

        // Update coordinates on drag
        marker.on('dragend', () => {
          const pos = marker.getLngLat()
          setPinLat(Math.round(pos.lat * 1000000) / 1000000)
          setPinLng(Math.round(pos.lng * 1000000) / 1000000)
        })

        markerRef.current = marker
      })

      mapRef.current = map
    }

    initMap()

    return () => {
      cancelled = true
      if (markerRef.current) markerRef.current.remove()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Extract YouTube video ID from URL
  const getYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /youtube\.com\/shorts\/([^&\s?]+)/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Save tour
  const handleSave = async () => {
    if (!title.trim() || !youtubeUrl.trim() || pinLat === null || pinLng === null) {
      alert('Please fill in the title, YouTube URL, and drop a pin on the map.')
      return
    }

    const videoId = getYoutubeId(youtubeUrl)
    if (!videoId) {
      alert('Please enter a valid YouTube URL.')
      return
    }

    setSaving(true)

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('neighborhood_tours')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          youtube_url: youtubeUrl.trim(),
          lat: pinLat,
          lng: pinLng
        })
        .eq('id', editingId)

      if (error) {
        alert('Error updating tour: ' + error.message)
      } else {
        setEditingId(null)
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('neighborhood_tours')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          youtube_url: youtubeUrl.trim(),
          lat: pinLat,
          lng: pinLng
        })

      if (error) {
        alert('Error saving tour: ' + error.message)
      }
    }

    // Reset form
    setTitle('')
    setDescription('')
    setYoutubeUrl('')
    setPinLat(null)
    setPinLng(null)
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }

    setSaving(false)
    fetchTours()
  }

  // Delete tour
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this neighborhood tour?')) return

    const { error } = await supabase
      .from('neighborhood_tours')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting tour: ' + error.message)
    } else {
      fetchTours()
    }
  }

  // Edit tour - populate form
  const handleEdit = async (tour: NeighborhoodTour) => {
    setEditingId(tour.id)
    setTitle(tour.title)
    setDescription(tour.description || '')
    setYoutubeUrl(tour.youtube_url)
    setPinLat(tour.lat)
    setPinLng(tour.lng)

    // Place marker on map
    if (mapRef.current) {
      const mapboxgl = (await import('mapbox-gl')).default

      if (markerRef.current) markerRef.current.remove()

      const marker = new mapboxgl.Marker({
        color: '#EF4444',
        draggable: true
      })
        .setLngLat([tour.lng, tour.lat])
        .addTo(mapRef.current)

      marker.on('dragend', () => {
        const pos = marker.getLngLat()
        setPinLat(Math.round(pos.lat * 1000000) / 1000000)
        setPinLng(Math.round(pos.lng * 1000000) / 1000000)
      })

      markerRef.current = marker
      mapRef.current.flyTo({ center: [tour.lng, tour.lat], zoom: 13 })
    }
  }

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setYoutubeUrl('')
    setPinLat(null)
    setPinLng(null)
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }

  return (
    <div className="space-y-6">
      {/* Map + Form Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Click the map to drop a pin
          </h3>
          <div
            ref={mapContainerRef}
            className="w-full rounded-lg border border-gray-300 overflow-hidden"
            style={{ height: '400px' }}
          />
          {pinLat !== null && pinLng !== null && (
            <p className="mt-2 text-xs text-gray-500">
              Pin: {pinLat}, {pinLng}
              <span className="ml-2 text-blue-600">(drag to adjust)</span>
            </p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            {editingId ? 'Edit Neighborhood Tour' : 'Add Neighborhood Tour'}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Neighborhood Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Virginia Beach Oceanfront"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              YouTube Video URL *
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {youtubeUrl && getYoutubeId(youtubeUrl) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of this neighborhood..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !youtubeUrl.trim() || pinLat === null}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : editingId ? 'Update Tour' : 'Save Tour'}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing Tours List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Saved Neighborhood Tours ({tours.length})
        </h3>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : tours.length === 0 ? (
          <p className="text-sm text-gray-500">
            No neighborhood tours yet. Drop a pin on the map and add a YouTube video to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.map((tour) => {
              const videoId = getYoutubeId(tour.youtube_url)
              return (
                <div
                  key={tour.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  {videoId && (
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900">{tour.title}</h4>
                    {tour.description && (
                      <p className="text-xs text-gray-500 mt-1">{tour.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {tour.lat.toFixed(4)}, {tour.lng.toFixed(4)}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(tour)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
