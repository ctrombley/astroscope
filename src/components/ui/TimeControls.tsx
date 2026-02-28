import type { AnimationState } from '../../types'

interface TimeControlsProps {
  animation: AnimationState
}

export default function TimeControls({ animation }: TimeControlsProps) {
  const { date, playing, speed, toggle, setSpeed, setDate, step } = animation

  const dateStr = date.toISOString().slice(0, 10)

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 px-6 py-3 bg-black/70 backdrop-blur-sm border-t border-white/10">
      {/* Step back */}
      <button
        onClick={() => step(-1)}
        className="px-2 py-1 text-sm text-white/80 hover:text-white border border-white/20 rounded"
        title="Step back 1 day"
      >
        &laquo;
      </button>

      {/* Play/Pause */}
      <button
        onClick={toggle}
        className="w-8 h-7 flex items-center justify-center text-white/80 hover:text-white bg-white/8 hover:bg-white/15 border border-white/15 rounded transition-colors"
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
        className="px-2 py-1 text-sm text-white/80 hover:text-white border border-white/20 rounded"
        title="Step forward 1 day"
      >
        &raquo;
      </button>

      {/* Speed slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">Speed</span>
        <input
          type="range"
          min={1}
          max={365}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="w-24 accent-[#C9A84C]"
        />
        <span className="text-xs text-white/70 w-16">{speed} d/s</span>
      </div>

      {/* Date picker */}
      <input
        type="date"
        value={dateStr}
        onChange={e => {
          const d = new Date(e.target.value + 'T12:00:00Z')
          if (!isNaN(d.getTime())) setDate(d)
        }}
        className="px-2 py-1 text-sm bg-black/50 text-white border border-white/20 rounded"
      />
    </div>
  )
}
