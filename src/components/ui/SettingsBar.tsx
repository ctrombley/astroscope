import { precessionalAge, dateToJD, ayanamsa } from '@ctrombley/astrokit'
import type { HouseSystem } from '@ctrombley/astrokit'
import type { AppSettings } from '../../types'

interface SettingsBarProps {
  settings: AppSettings
  date: Date
  onUpdate: (partial: Partial<AppSettings>) => void
}

const HOUSE_SYSTEMS: { value: HouseSystem; label: string }[] = [
  { value: 'whole-sign', label: 'Whole Sign' },
  { value: 'equal', label: 'Equal' },
  { value: 'placidus', label: 'Placidus' },
  { value: 'porphyry', label: 'Porphyry' },
]

export default function SettingsBar({ settings, date, onUpdate }: SettingsBarProps) {
  const jd = dateToJD(date)
  const age = precessionalAge(jd)
  const ayan = ayanamsa(jd)

  return (
    <div className="absolute top-0 left-0 flex items-center gap-4 px-4 py-2 bg-black/70 backdrop-blur-sm border-b border-white/10">
      {/* House system */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-white/50">Houses</label>
        <select
          value={settings.houseSystem}
          onChange={e => onUpdate({ houseSystem: e.target.value as HouseSystem })}
          className="text-xs bg-black/50 text-white border border-white/20 rounded px-1 py-0.5"
        >
          {HOUSE_SYSTEMS.map(h => (
            <option key={h.value} value={h.value}>{h.label}</option>
          ))}
        </select>
      </div>

      {/* Sidereal toggle */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-white/50">Sidereal</label>
        <button
          onClick={() => onUpdate({ sidereal: !settings.sidereal })}
          className={`px-2 py-0.5 text-xs rounded border transition-colors ${
            settings.sidereal
              ? 'bg-[#C9A84C]/12 border-[#C9A84C]/35 text-[#C9A84C]'
              : 'bg-white/5 border-white/15 text-white/35'
          }`}
        >
          {settings.sidereal ? 'ON' : 'OFF'}
        </button>
        {settings.sidereal && (
          <span className="text-xs text-white/40">Ayanamsa: {ayan.toFixed(2)}&deg;</span>
        )}
      </div>

      {/* Harmonics toggle */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-white/50">Harmonics</label>
        <button
          onClick={() => onUpdate({ showHarmonics: !settings.showHarmonics })}
          className={`px-2 py-0.5 text-xs rounded border transition-colors ${
            settings.showHarmonics
              ? 'bg-[#7040A0]/15 border-[#7040A0]/40 text-[#9060C0]'
              : 'bg-white/5 border-white/15 text-white/35'
          }`}
        >
          {settings.showHarmonics ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Precessional age */}
      <div className="text-xs text-white/40 ml-auto">
        Age of {age.ageName} ({age.degreeInSign.toFixed(1)}&deg;)
      </div>
    </div>
  )
}
