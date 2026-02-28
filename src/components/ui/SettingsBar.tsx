import { precessionalAge, dateToJD, ayanamsa } from '@ctrombley/astrokit'
import type { HouseSystem } from '@ctrombley/astrokit'
import type { AppSettings, BirthChartData, ViewMode } from '../../types'

interface SettingsBarProps {
  settings: AppSettings
  date: Date
  onUpdate: (partial: Partial<AppSettings>) => void
  birthChart: BirthChartData | null
  onOpenBirthChart: () => void
  viewMode: ViewMode
  onSetViewMode: (mode: ViewMode) => void
  showConstellations: boolean
  onToggleConstellations: () => void
  showStarNames: boolean
  onToggleStarNames: () => void
  skySettled: boolean
}

const HOUSE_SYSTEMS: { value: HouseSystem; label: string }[] = [
  { value: 'whole-sign', label: 'Whole Sign' },
  { value: 'equal', label: 'Equal' },
  { value: 'placidus', label: 'Placidus' },
  { value: 'porphyry', label: 'Porphyry' },
]

export default function SettingsBar({
  settings, date, onUpdate,
  birthChart, onOpenBirthChart,
  viewMode, onSetViewMode,
  showConstellations, onToggleConstellations,
  showStarNames, onToggleStarNames,
  skySettled,
}: SettingsBarProps) {
  const jd = dateToJD(date)
  const age = precessionalAge(jd)
  const ayan = ayanamsa(jd)

  return (
    <div className="absolute top-0 left-0 flex items-center gap-4 px-4 py-2 bg-black/70 backdrop-blur-sm border-b border-white/10">
      {/* View mode toggle */}
      <div className="flex items-center gap-1 rounded border border-white/15 overflow-hidden">
        <button
          onClick={() => onSetViewMode('orrery')}
          className={`px-2 py-0.5 text-xs transition-colors ${
            viewMode === 'orrery'
              ? 'bg-[#C9A84C]/20 text-[#C9A84C] border-r border-white/10'
              : 'text-white/40 hover:text-white/70 border-r border-white/10'
          }`}
        >
          Orrery
        </button>
        <button
          onClick={() => onSetViewMode('sky')}
          className={`px-2 py-0.5 text-xs transition-colors ${
            viewMode === 'sky'
              ? 'bg-[#3050A0]/20 text-[#6080d0]'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Night Sky
        </button>
      </div>

      {/* Sky mode overlays — only visible in sky view, fade in once settled */}
      {viewMode === 'sky' && (
        <div
          className="flex items-center gap-3 border-l border-white/10 pl-4 transition-opacity duration-500"
          style={{ opacity: skySettled ? 1 : 0 }}
        >
          <button
            onClick={onToggleConstellations}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              showConstellations
                ? 'bg-[#4060b8]/20 border-[#4060b8]/50 text-[#7090d8]'
                : 'bg-white/5 border-white/15 text-white/35 hover:text-white/60'
            }`}
          >
            Constellations
          </button>
          <button
            onClick={onToggleStarNames}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              showStarNames
                ? 'bg-[#8080a0]/20 border-[#8080a0]/50 text-[#b0b0cc]'
                : 'bg-white/5 border-white/15 text-white/35 hover:text-white/60'
            }`}
          >
            Star Names
          </button>
        </div>
      )}

      {/* Orrery-mode controls — only visible in orrery view */}
      {viewMode === 'orrery' && (
        <>
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

          {/* Angles toggle */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/50">Angles</label>
            <button
              onClick={() => onUpdate({ showAngles: !settings.showAngles })}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                settings.showAngles
                  ? 'bg-[#C9A84C]/12 border-[#C9A84C]/35 text-[#C9A84C]'
                  : 'bg-white/5 border-white/15 text-white/35'
              }`}
            >
              {settings.showAngles ? 'ON' : 'OFF'}
            </button>
          </div>
        </>
      )}

      {/* Birth Chart — always visible */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenBirthChart}
          className={`px-2 py-0.5 text-xs rounded border transition-colors ${
            birthChart
              ? 'bg-[#C9A84C]/12 border-[#C9A84C]/35 text-[#C9A84C]'
              : 'bg-white/5 border-white/15 text-white/35 hover:text-white/60'
          }`}
        >
          Birth Chart
        </button>
        {birthChart && (
          <span className="px-2 py-0.5 text-xs rounded border bg-[#C9A84C]/10 border-[#C9A84C]/25 text-[#C9A84C]/80">
            Natal: {birthChart.name || birthChart.locationName.split(',')[0]}
          </span>
        )}
      </div>

      {/* Precessional age */}
      <div className="text-xs text-white/40 ml-auto">
        Age of {age.ageName} ({age.degreeInSign.toFixed(1)}&deg;)
      </div>
    </div>
  )
}
