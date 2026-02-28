import {
  PLANETS,
  CelestialBody,
  evaluateDignity,
  decanAtDegree,
  signAtDegree,
  SIGN_SYMBOLS,
  SIGN_NAMES,
  dateToJD,
} from '@ctrombley/astrokit'
import { PLANET_COLORS } from '../../constants/colors'
import type { PlanetPosition } from '../../types'

interface PlanetDetailProps {
  planet: PlanetPosition
  date: Date
  onClose: () => void
}

export default function PlanetDetail({ planet, date, onClose }: PlanetDetailProps) {
  const { key, name, symbol, longitudeDeg, retrograde, dailyMotionDeg } = planet
  const color = PLANET_COLORS[key] ?? '#AAAAAA'
  const sign = signAtDegree(longitudeDeg)
  const degInSign = longitudeDeg - sign.startDegree
  const decan = decanAtDegree(longitudeDeg)
  const dignity = evaluateDignity(key, longitudeDeg)
  const body = new CelestialBody(key)

  // Synodic periods with other planets
  const synodicPairs = ['mercury', 'venus', 'mars', 'jupiter', 'saturn']
    .filter(k => k !== key)
    .map(k => {
      const other = new CelestialBody(k)
      return {
        name: other.name,
        period: body.synodicPeriodWith(other),
      }
    })
    .filter(s => isFinite(s.period) && s.period > 0)

  return (
    <div className="absolute top-4 left-4 w-64 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold" style={{ color }}>
          {symbol} {name}
        </h2>
        <button onClick={onClose} className="text-white/40 hover:text-white text-lg">
          &times;
        </button>
      </div>

      {/* Position */}
      <div className="mb-3 space-y-1">
        <div className="flex justify-between">
          <span className="text-white/50">Position</span>
          <span className="text-white/90">
            {degInSign.toFixed(2)}&deg; {SIGN_SYMBOLS[sign.index]} {sign.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Motion</span>
          <span className="text-white/90">
            {Math.abs(dailyMotionDeg).toFixed(4)}&deg;/day
            {retrograde && <span className="text-[#9A4040] ml-1">Rx</span>}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Decan</span>
          <span className="text-white/90">
            {decan.decanInSign + 1} ({decan.chaldeanRuler})
          </span>
        </div>
      </div>

      {/* Dignity */}
      <div className="mb-3">
        <h3 className="text-white/60 text-xs uppercase mb-1">Dignity Report</h3>
        <div className="space-y-1">
          {dignity.dignities.map((d, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-white/70 capitalize">{d.type}</span>
              <span className={d.score > 0 ? 'text-[#5A9A70]' : d.score < 0 ? 'text-[#9A4040]' : 'text-white/35'}>
                {d.score > 0 ? '+' : ''}{d.score}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-bold border-t border-white/10 pt-1 mt-1">
            <span className="text-white/90">Total</span>
            <span className={dignity.totalScore > 0 ? 'text-[#5A9A70]' : dignity.totalScore < 0 ? 'text-[#9A4040]' : 'text-white/50'}>
              {dignity.totalScore > 0 ? '+' : ''}{dignity.totalScore}
            </span>
          </div>
        </div>
      </div>

      {/* Orbital info */}
      {body.orbitalPeriodYears && (
        <div className="mb-3">
          <h3 className="text-white/60 text-xs uppercase mb-1">Orbital Data</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">Period</span>
              <span className="text-white/90">{body.orbitalPeriodYears.toFixed(2)} years</span>
            </div>
            {body.orbitalFrequency && (
              <div className="flex justify-between">
                <span className="text-white/50">Frequency</span>
                <span className="text-white/90">{body.orbitalFrequency.toFixed(4)}/yr</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Synodic periods */}
      {synodicPairs.length > 0 && (
        <div>
          <h3 className="text-white/60 text-xs uppercase mb-1">Synodic Periods</h3>
          <div className="space-y-1 text-xs">
            {synodicPairs.slice(0, 4).map(s => (
              <div key={s.name} className="flex justify-between">
                <span className="text-white/50">w/ {s.name}</span>
                <span className="text-white/90">{s.period.toFixed(1)} days</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
