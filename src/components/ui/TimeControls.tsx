import type { AnimationState } from '../../types'

interface TimeControlsProps {
  animation: AnimationState
}

const MIN_SPEED = 0.01
const MAX_SPEED = 365
const LOG_RATIO = Math.log(MAX_SPEED / MIN_SPEED)

function posToSpeed(pos: number): number {
  return MIN_SPEED * Math.exp(LOG_RATIO * pos / 100)
}

function speedToPos(speed: number): number {
  return 100 * Math.log(speed / MIN_SPEED) / LOG_RATIO
}

function formatSpeed(speed: number): string {
  if (speed < 1 / 24) return `${(speed * 24 * 60).toFixed(0)} min/s`
  if (speed < 1) return `${(speed * 24).toFixed(1)} h/s`
  if (speed < 10) return `${speed.toFixed(1)} d/s`
  return `${Math.round(speed)} d/s`
}

export default function TimeControls({ animation }: TimeControlsProps) {
  const { date, playing, speed, toggle, setSpeed, setDate, step } = animation

  const dateStr = date.toISOString().slice(0, 10)
  const sliderPos = Math.round(speedToPos(speed))

  return (
    <div className="absolute bottom-0 left-0 right-0 md:right-72 flex items-center justify-center gap-2 md:gap-4 px-3 md:px-6 py-2 md:py-3 bg-black/70 backdrop-blur-sm border-t border-white/10">
      {/* Step back */}
      <button
        onClick={() => step(-1)}
        className="px-2 py-1.5 md:py-1 text-sm text-white/80 hover:text-white border border-white/20 rounded"
        title="Step back 1 day"
      >
        &laquo;
      </button>

      {/* Play/Pause */}
      <button
        onClick={toggle}
        className="w-9 h-8 md:w-8 md:h-7 flex items-center justify-center text-white/80 hover:text-white bg-white/8 hover:bg-white/15 border border-white/15 rounded transition-colors"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
            <rect x="0" y="0" width="3.5" height="11" rx="0.5" />
            <rect x="6.5" y="0" width="3.5" height="11" rx="0.5" />
          </svg>
        ) : (
          <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
            <path d="M0 0 L10 5.5 L0 11 Z" />
          </svg>
        )}
      </button>

      {/* Step forward */}
      <button
        onClick={() => step(1)}
        className="px-2 py-1.5 md:py-1 text-sm text-white/80 hover:text-white border border-white/20 rounded"
        title="Step forward 1 day"
      >
        &raquo;
      </button>

      {/* Speed slider */}
      <div className="flex items-center gap-1 md:gap-2">
        <span className="hidden md:inline text-xs text-white/50">Speed</span>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={e => setSpeed(posToSpeed(Number(e.target.value)))}
          className="w-16 md:w-24 accent-[#C9A84C]"
        />
        <span className="text-xs text-white/70 w-12 md:w-16">{formatSpeed(speed)}</span>
      </div>

      {/* Date picker */}
      <input
        type="date"
        value={dateStr}
        onChange={e => {
          const d = new Date(e.target.value + 'T12:00:00Z')
          if (!isNaN(d.getTime())) setDate(d)
        }}
        className="px-2 py-1.5 md:py-1 text-xs md:text-sm bg-black/50 text-white border border-white/20 rounded"
      />
    </div>
  )
}
