'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  return found ? found.label : category
}
const emptyForm = {
  title: '',
  description: '',
  youtube_url: '',
  lat: '',
  lng: '',
  category: 'neighborhood_tour',
}

export default function NeighborhoodToursTab() {
  const supabase = createClient()
  const [tours, setTours] = useState<VideoLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchTours = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('neighborhood_tours')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError('Failed to load tours: ' + error.message)
    } else {
      setTours(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  const handleEdit = (tour: VideoLink) => {
    setEditingId(tour.id)
    setForm({
      title: tour.title,
      description: tour.description || '',
      youtube_url: tour.youtube_url,
      lat: String(tour.lat),
      lng: String(tour.lng),
      category: tour.category,
    })
    setError('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const handleSave = async () => {
    if (!form.title || !form.youtube_url || !form.lat || !form.lng) {
      setError('Title, YouTube URL, Latitude, and Longitude are required.')
      return
    }
    const lat = parseFloat(form.lat)
    const lng = parseFloat(form.lng)
    if (isNaN(lat) || isNaN(lng)) {
      setError('Latitude and Longitude must be valid numbers.')
      return
    }

    setSaving(true)
    setError('')

    const record = {
      title: form.title,
      description: form.description || null,
      youtube_url: form.youtube_url,
      lat,
      lng,
      category: form.category,
    }

    if (editingId) {
      const { error } = await supabase
        .from('neighborhood_tours')
        .update(record)
        .eq('id', editingId)
      if (error) {
        setError('Failed to update: ' + error.message)
      } else {
        setEditingId(null)
        setForm(emptyForm)
        fetchTours()
      }
    } else {
      const { error } = await supabase
        .from('neighborhood_tours')
        .insert(record)
      if (error) {
        setError('Failed to create: ' + error.message)
      } else {
        setForm(emptyForm)
        fetchTours()
      }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video marker?')) return
    const { error } = await supabase
      .from('neighborhood_tours')
      .delete()
      .eq('id', id)
    if (error) {
      setError('Failed to delete: ' + error.message)
    } else {
      if (editingId === id) handleCancel()
      fetchTours()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Neighborhood Video Tours</h2>
        <span className="text-sm text-gray-500">{tours.length} markers</span>
      </div>

      {/* Note about Google Maps migration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Note:</strong> Map preview is being migrated to Google Maps. You can still add and manage video markers using the form below. Lat/Lng coordinates are required — use Google Maps to find coordinates for now.
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
        <h3 className="font-semibold text-gray-800">
          {editingId ? 'Edit Video Marker' : 'Add New Video Marker'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Great Neck Neighborhood Tour"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">YouTube URL *</label>
            <input
              type="text"
              value={form.youtube_url}
              onChange={e => setForm({ ...form, youtube_url: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Latitude *</label>
            <input
              type="text"
              value={form.lat}
              onChange={e => setForm({ ...form, lat: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 36.8529"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Longitude *</label>
            <input
              type="text"
              value={form.lng}
              onChange={e => setForm({ ...form, lng: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. -76.2906"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Optional description"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingId ? 'Update Marker' : 'Add Marker'}
          </button>
          {editingId && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Tours List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading tours...</div>
      ) : tours.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No video markers yet. Add one above.</div>
      ) : (
        <div className="space-y-2">
          {tours.map(tour => (
            <div
              key={tour.id}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getCategoryColor(tour.category) }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{tour.title}</div>
                <div className="text-xs text-gray-500">
                  {getCategoryLabel(tour.category)} &middot; ({tour.lat.toFixed(4)}, {tour.lng.toFixed(4)})
                </div>
                {tour.description && (
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{tour.description}</div>
                )}
              </div>
              <a
                href={tour.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
              >
                View
              </a>
              <button
                onClick={() => handleEdit(tour)}
                className="text-xs text-gray-500 hover:text-gray-800 flex-shrink-0"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tour.id)}
                className="text-xs text-red-500 hover:text-red-700 flex-shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
