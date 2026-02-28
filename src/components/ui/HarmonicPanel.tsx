import type { HarmonicData } from '../../hooks/useHarmonics'

interface HarmonicPanelProps {
  harmonics: HarmonicData
  visible: boolean
}

export default function HarmonicPanel({ harmonics, visible }: HarmonicPanelProps) {
  if (!visible) return null

  const { spectrum } = harmonics
  const maxStrength = Math.max(...spectrum.map(s => s.strength), 0.001)

  return (
    <div className={[
      // Mobile: float below SettingsBar on the left
      'fixed top-14 left-2 right-2 z-50',
      'max-h-[50vh] overflow-y-auto',
      // Desktop: absolute bottom-left above TimeControls
      'md:absolute md:top-auto md:bottom-16 md:left-4',
      'md:right-auto md:w-72 md:max-h-none',
      // Shared
      'bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg p-4',
    ].join(' ')}>
      <h3 className="text-white/80 text-sm font-bold mb-3">Harmonic Spectrum</h3>
      <div className="space-y-1">
        {spectrum.map(s => (
          <div key={s.harmonic} className="flex items-center gap-2">
            <span className="text-xs text-white/50 w-6 text-right">H{s.harmonic}</span>
            <div className="flex-1 h-3 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full rounded"
                style={{
                  width: `${(s.strength / maxStrength) * 100}%`,
                  backgroundColor: `hsl(${(s.harmonic * 30) % 360}, 35%, 45%)`,
                }}
              />
            </div>
            <span className="text-xs text-white/40 w-8 text-right">
              {s.clusterCount > 0 ? `${s.clusterCount}c` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
