import { useState } from 'react'
import type { BirthChartData } from '../../types'

interface BirthChartModalProps {
  current: BirthChartData | null
  onApply: (data: BirthChartData) => void
  onClear: () => void
  onClose: () => void
}

export default function BirthChartModal({ current, onApply, onClear, onClose }: BirthChartModalProps) {
  const [name, setName] = useState(current?.name ?? '')
  const [birthDate, setBirthDate] = useState(() => {
    if (current) return current.date.toISOString().slice(0, 10)
    return new Date().toISOString().slice(0, 10)
  })
  const [birthTime, setBirthTime] = useState(() => {
    if (current) {
      const h = current.date.getUTCHours().toString().padStart(2, '0')
      const m = current.date.getUTCMinutes().toString().padStart(2, '0')
      return `${h}:${m}`
    }
    return '12:00'
  })
  const [utcOffset, setUtcOffset] = useState(0)
  const [place, setPlace] = useState(current?.locationName ?? '')
  const [latitude, setLatitude] = useState<number | null>(current?.latitude ?? null)
  const [longitude, setLongitude] = useState<number | null>(current?.longitude ?? null)
  const [resolvedName, setResolvedName] = useState(current?.locationName ?? '')
  const [geoError, setGeoError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  async function handleFind() {
    if (!place.trim()) return
    setGeoLoading(true)
    setGeoError('')
    setResolvedName('')
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const data = await res.json()
      if (!data.length) {
        setGeoError('Location not found.')
      } else {
        setLatitude(parseFloat(data[0].lat))
        setLongitude(parseFloat(data[0].lon))
        setResolvedName(data[0].display_name)
      }
    } catch {
      setGeoError('Geocoding failed. Check your connection.')
    } finally {
      setGeoLoading(false)
    }
  }

  function handleApply() {
    if (!birthDate || latitude === null || longitude === null) return
    const parts = birthTime.split(':').map(Number)
    const hours = parts[0] ?? 0
    const minutes = parts[1] ?? 0
    const localMs =
      new Date(`${birthDate}T00:00:00Z`).getTime() +
      hours * 3600000 +
      minutes * 60000
    const utcMs = localMs - utcOffset * 3600000
    const utcDate = new Date(utcMs)
    onApply({
      name: name.trim() || undefined,
      date: utcDate,
      latitude: latitude,
      longitude: longitude,
      locationName: resolvedName || place,
    })
  }

  const canApply = birthDate && latitude !== null && longitude !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0D0D14] border border-white/15 rounded-lg shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[#C9A84C] tracking-widest uppercase">Birth Chart</h2>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Albert Einstein"
            className="px-2 py-1 text-sm bg-black/50 text-white border border-white/20 rounded focus:outline-none focus:border-[#C9A84C]/50"
          />
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50">Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="px-2 py-1 text-sm bg-black/50 text-white border border-white/20 rounded focus:outline-none focus:border-[#C9A84C]/50"
          />
        </div>

        {/* Birth Time + UTC Offset */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-white/50">Birth Time (local)</label>
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="px-2 py-1 text-sm bg-black/50 text-white border border-white/20 rounded focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div className="flex flex-col gap-1 w-28">
            <label className="text-xs text-white/50">UTC offset (hrs)</label>
            <input
              type="number"
              value={utcOffset}
              onChange={e => setUtcOffset(parseFloat(e.target.value) || 0)}
              step={0.5}
              min={-14}
              max={14}
              className="px-2 py-1 text-sm bg-black/50 text-white border border-white/20 rounded focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
        </div>

        {/* Birthplace */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50">Birthplace</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={place}
              onChange={e => { setPlace(e.target.value); setResolvedName(''); setLatitude(null); setLongitude(null); setGeoError('') }}
              onKeyDown={e => e.key === 'Enter' && handleFind()}
              placeholder="City, Country"
              className="flex-1 px-2 py-1 text-sm bg-black/50 text-white border border-white/20 rounded focus:outline-none focus:border-[#C9A84C]/50"
            />
            <button
              onClick={handleFind}
              disabled={geoLoading || !place.trim()}
              className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white rounded transition-colors disabled:opacity-40"
            >
              {geoLoading ? '...' : 'Find'}
            </button>
          </div>
          {resolvedName && (
            <p className="text-xs text-[#C9A84C]/70 mt-0.5 leading-snug">{resolvedName}</p>
          )}
          {geoError && (
            <p className="text-xs text-red-400 mt-0.5">{geoError}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleApply}
            disabled={!canApply}
            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded border transition-colors
              bg-[#C9A84C]/12 border-[#C9A84C]/35 text-[#C9A84C]
              hover:bg-[#C9A84C]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            View Chart
          </button>
          {current && (
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-xs rounded border border-white/15 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded border border-white/15 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
