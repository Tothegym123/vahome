'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createClient } from '../lib/supabase/client'

type VideoLink = {
  id: string
  title: string
  description: string | null
  youtube_url: string
  lat: number
  lng: number
  category: string
  created_at: string
}

const CATEGORY_OPTIONS = [
  { value: 'neighborhood_tour', label: 'Neighborhood Tour', color: '#e74c3c' },
  { value: 'outdoor_space_tour', label: 'Outdoor Space Tour', color: '#2ecc71' },
  { value: 'entertainment', label: 'Entertainment', color: '#3498db' },
]

function getCategoryColor(category: string): string {
  const found = CATEGORY_OPTIONS.find(c => c.value === category)
  return found ? found.color : '#e74c3c'
}

function getCategoryLabel(category: string): string {
  const found = CATEGORY_OPTIONS.find(c => c.value === category)
  return found ? found.label : 'Neighborhood Tour'
}

export default function NeighborhoodToursTab() {
  const supabase = createClient()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const tourMarkersRef = useRef<any[]>([])

  const [tours, setTours] = useState<VideoLink[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [category, setCategory] = useState('neighborhood_tour')
  const [pinLat, setPinLat] = useState<number | null>(null)
  const [pinLng, setPinLng] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchTours = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('neighborhood_tours')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setTours(data || [])
    } catch (err) {
      console.error('Error fetching video links:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return
    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-76.15, 36.85],
        zoom: 11,
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
        mapRef.current = map
        setMapLoaded(true)
      })

      map.on('click', (e: any) => {
        const lat = e.lngLat.lat
        const lng = e.lngLat.lng
        setPinLat(lat)
        setPinLng(lng)

        // Remove old draggable marker
        if (markerRef.current) {
          markerRef.current.remove()
        }

        // Get current category color for the marker
        const catSelect = document.getElementById('category-select') as HTMLSelectElement
        const currentCat = catSelect ? catSelect.value : 'neighborhood_tour'
        const markerColor = getCategoryColor(currentCat)

        const marker = new mapboxgl.Marker({ draggable: true, color: markerColor })
          .setLngLat([lng, lat])
          .addTo(map)

        marker.on('dragend', () => {
          const lngLat = marker.getLngLat()
          setPinLat(lngLat.lat)
          setPinLng(lngLat.lng)
        })

        markerRef.current = marker
      })
    }
    initMap()
  }, [])

  // Display saved tour markers on map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    const loadMarkers = async () => {
      const mapboxgl = (await import('mapbox-gl')).default

      // Clear old markers
      tourMarkersRef.current.forEach(m => m.remove())
      tourMarkersRef.current = []

      tours.forEach(tour => {
        const color = getCategoryColor(tour.category || 'neighborhood_tour')
        const marker = new mapboxgl.Marker({ color })
          .setLngLat([tour.lng, tour.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${tour.title}</strong><br/><span style="font-size:11px;color:#666">${getCategoryLabel(tour.category || 'neighborhood_tour')}</span><br/>${tour.description || ''}`
            )
          )
          .addTo(mapRef.current)
        tourMarkersRef.current.push(marker)
      })
    }
    loadMarkers()
  }, [tours, mapLoaded])

  // Fetch tours on mount
  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  const getYoutubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    return match ? match[1] : null
  }

  const handleSave = async () => {
    if (!title || !youtubeUrl || pinLat === null || pinLng === null) {
      alert('Please fill in title, YouTube URL, and drop a pin on the map.')
      return
    }
    if (!getYoutubeId(youtubeUrl)) {
      alert('Invalid YouTube URL. Please paste a valid YouTube link.')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const { error } = await supabase
          .from('neighborhood_tours')
          .update({
            title,
            description: description || null,
            youtube_url: youtubeUrl,
            lat: pinLat,
            lng: pinLng,
            category,
          })
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('neighborhood_tours')
          .insert({
            title,
            description: description || null,
            youtube_url: youtubeUrl,
            lat: pinLat,
            lng: pinLng,
            category,
          })
        if (error) throw error
      }

      // Reset form
      setTitle('')
      setDescription('')
      setYoutubeUrl('')
      setCategory('neighborhood_tour')
      setPinLat(null)
      setPinLng(null)
      setEditingId(null)
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }

      await fetchTours()
    } catch (err) {
      console.error('Error saving video link:', err)
      alert('Failed to save. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video link?')) return
    try {
      const { error } = await supabase
        .from('neighborhood_tours')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchTours()
    } catch (err) {
      console.error('Error deleting video link:', err)
    }
  }

  const handleEdit = async (tour: VideoLink) => {
    setTitle(tour.title)
    setDescription(tour.description || '')
    setYoutubeUrl(tour.youtube_url)
    setCategory(tour.category || 'neighborhood_tour')
    setPinLat(tour.lat)
    setPinLng(tour.lng)
    setEditingId(tour.id)

    if (mapRef.current) {
      const mapboxgl = (await import('mapbox-gl')).default

      if (markerRef.current) {
        markerRef.current.remove()
      }

      const markerColor = getCategoryColor(tour.category || 'neighborhood_tour')
      const marker = new mapboxgl.Marker({ draggable: true, color: markerColor })
        .setLngLat([tour.lng, tour.lat])
        .addTo(mapRef.current)

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat()
        setPinLat(lngLat.lat)
        setPinLng(lngLat.lng)
      })

      markerRef.current = marker
      mapRef.current.flyTo({ center: [tour.lng, tour.lat], zoom: 14 })
    }
  }

  // Update marker color when category changes
  const handleCategoryChange = async (newCategory: string) => {
    setCategory(newCategory)
    if (markerRef.current && pinLat !== null && pinLng !== null && mapRef.current) {
      const mapboxgl = (await import('mapbox-gl')).default
      const lngLat = markerRef.current.getLngLat()
      markerRef.current.remove()

      const markerColor = getCategoryColor(newCategory)
      const marker = new mapboxgl.Marker({ draggable: true, color: markerColor })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(mapRef.current)

      marker.on('dragend', () => {
        const ll = marker.getLngLat()
        setPinLat(ll.lat)
        setPinLng(ll.lng)
      })

      markerRef.current = marker
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
        Video Links
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Click the map to drop a pin, fill in the details, select a category, and save.
      </p>

      {/* Map + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Map */}
        <div>
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '400px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          {pinLat && pinLng && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
              Pin: {pinLat.toFixed(5)}, {pinLng.toFixed(5)}
            </p>
          )}
          {/* Legend */}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {CATEGORY_OPTIONS.map(opt => (
              <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: opt.color, display: 'inline-block' }} />
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Great Neck Area Tour"
              style={{
                width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                borderRadius: '6px', fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              Category *
            </label>
            <select
              id="category-select"
              value={category}
              onChange={e => handleCategoryChange(e.target.value)}
              style={{
                width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                borderRadius: '6px', fontSize: '0.9rem', backgroundColor: '#fff',
              }}
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              YouTube URL *
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                borderRadius: '6px', fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              style={{
                width: '100%', padding: '0.5rem', border: '1px solid #d1d5db',
                borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff',
                border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
                opacity: saving ? 0.6 : 1, fontSize: '0.9rem',
              }}
            >
              {saving ? 'Saving...' : editingId ? 'Update Video Link' : 'Save Video Link'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null)
                  setTitle('')
                  setDescription('')
                  setYoutubeUrl('')
                  setCategory('neighborhood_tour')
                  setPinLat(null)
                  setPinLng(null)
                  if (markerRef.current) {
                    markerRef.current.remove()
                    markerRef.current = null
                  }
                }}
                style={{
                  padding: '0.6rem 1.5rem', backgroundColor: '#6b7280', color: '#fff',
                  border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Video Links */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
        Saved Video Links {tours.length > 0 && `(${tours.length})`}
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : tours.length === 0 ? (
        <p style={{ color: '#999' }}>No video links yet. Drop a pin and add one above.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {tours.map(tour => {
            const videoId = getYoutubeId(tour.youtube_url)
            const catColor = getCategoryColor(tour.category || 'neighborhood_tour')
            const catLabel = getCategoryLabel(tour.category || 'neighborhood_tour')
            return (
              <div
                key={tour.id}
                style={{
                  border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                {videoId && (
                  <iframe
                    width="100%"
                    height="180"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'block' }}
                  />
                )}
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{
                      display: 'inline-block', width: '10px', height: '10px',
                      borderRadius: '50%', backgroundColor: catColor,
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>
                      {catLabel}
                    </span>
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{tour.title}</h4>
                  {tour.description && (
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                      {tour.description}
                    </p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>
                    {tour.lat.toFixed(4)}, {tour.lng.toFixed(4)}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(tour)}
                      style={{
                        padding: '0.3rem 0.75rem', backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db', borderRadius: '4px',
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      style={{
                        padding: '0.3rem 0.75rem', backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca', borderRadius: '4px',
                        fontSize: '0.8rem', cursor: 'pointer', color: '#dc2626',
                      }}
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
  )
}
