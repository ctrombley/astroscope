import { useState } from 'react'
import {
  signAtDegree,
  SIGN_SYMBOLS,
  ELEMENTS,
  MODALITIES,
} from '@ctrombley/astrokit'
import type { Chart } from '@ctrombley/astrokit'
import { ELEMENT_COLORS, MODALITY_COLORS, ASPECT_COLORS } from '../../constants/colors'
import type { PlanetPosition } from '../../types'

type Tab = 'positions' | 'aspects' | 'balance' | 'patterns' | 'lots'

interface InfoPanelProps {
  chart: Chart
  positions: PlanetPosition[]
  aspects: ReturnType<Chart['aspects']>
  balance: ReturnType<Chart['balance']>
  patterns: string[]
  lots: ReturnType<Chart['lots']>
}

export default function InfoPanel({
  chart,
  positions,
  aspects,
  balance,
  patterns,
  lots,
}: InfoPanelProps) {
  const [tab, setTab] = useState<Tab>('positions')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'positions', label: 'Planets' },
    { key: 'aspects', label: 'Aspects' },
    { key: 'balance', label: 'Balance' },
    { key: 'patterns', label: 'Patterns' },
    { key: 'lots', label: 'Lots' },
  ]

  return (
    <div className="absolute top-0 right-0 w-72 h-full bg-black/80 backdrop-blur-sm border-l border-white/10 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-white/10 shrink-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-2 py-2 text-xs tracking-wide ${
              tab === t.key
                ? 'text-[#C9A84C] border-b border-[#C9A84C]/70'
                : 'text-white/35 hover:text-white/65'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 text-sm">
        {tab === 'positions' && <PositionsTab positions={positions} />}
        {tab === 'aspects' && <AspectsTab aspects={aspects} />}
        {tab === 'balance' && <BalanceTab balance={balance} />}
        {tab === 'patterns' && <PatternsTab patterns={patterns} />}
        {tab === 'lots' && <LotsTab lots={lots} />}
      </div>
    </div>
  )
}

function PositionsTab({ positions }: { positions: PlanetPosition[] }) {
  return (
    <div className="space-y-1">
      {positions.map(p => {
        const sign = signAtDegree(p.longitudeDeg)
        const degInSign = p.longitudeDeg - sign.startDegree
        return (
          <div key={p.key} className="flex items-center justify-between py-1">
            <span className="text-white/90">
              {p.symbol} {p.name}
            </span>
            <span className="text-white/60 text-xs">
              {degInSign.toFixed(1)}&deg; {SIGN_SYMBOLS[sign.index]}
              {p.retrograde && <span className="text-[#9A4040] ml-1">Rx</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function AspectsTab({ aspects }: { aspects: ReturnType<Chart['aspects']> }) {
  return (
    <div className="space-y-1">
      {aspects.map((a, i) => (
        <div key={i} className="flex items-center justify-between py-1 text-xs">
          <span className="text-white/90">
            {a.body1.body.symbol} {a.aspect.symbol} {a.body2.body.symbol}
          </span>
          <span style={{ color: ASPECT_COLORS[a.aspect.name] }}>
            {a.aspect.name}
          </span>
          <span className="text-white/40">
            {a.orb.toFixed(1)}&deg; {a.applying ? 'a' : 's'}
          </span>
        </div>
      ))}
      {aspects.length === 0 && (
        <p className="text-white/40 text-center">No aspects found</p>
      )}
    </div>
  )
}

function BalanceTab({ balance }: { balance: ReturnType<Chart['balance']> }) {
  const maxEl = Math.max(...ELEMENTS.map(e => balance.elements[e]))
  const maxMod = Math.max(...MODALITIES.map(m => balance.modalities[m]))

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white/60 text-xs uppercase mb-2">Elements</h3>
        {ELEMENTS.map(el => (
          <div key={el} className="flex items-center gap-2 mb-1">
            <span className="w-12 text-xs capitalize" style={{ color: ELEMENT_COLORS[el] }}>
              {el}
            </span>
            <div className="flex-1 h-3 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full rounded"
                style={{
                  width: `${(balance.elements[el] / maxEl) * 100}%`,
                  backgroundColor: ELEMENT_COLORS[el],
                  opacity: 0.7,
                }}
              />
            </div>
            <span className="text-xs text-white/50 w-4 text-right">
              {balance.elements[el]}
            </span>
          </div>
        ))}
        <p className="text-xs text-white/40 mt-1">
          Dominant: <span className="text-white/70 capitalize">{balance.dominantElement}</span>
        </p>
      </div>

      <div>
        <h3 className="text-white/60 text-xs uppercase mb-2">Modalities</h3>
        {MODALITIES.map(mod => (
          <div key={mod} className="flex items-center gap-2 mb-1">
            <span className="w-12 text-xs capitalize" style={{ color: MODALITY_COLORS[mod] }}>
              {mod}
            </span>
            <div className="flex-1 h-3 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full rounded"
                style={{
                  width: `${(balance.modalities[mod] / maxMod) * 100}%`,
                  backgroundColor: MODALITY_COLORS[mod],
                  opacity: 0.7,
                }}
              />
            </div>
            <span className="text-xs text-white/50 w-4 text-right">
              {balance.modalities[mod]}
            </span>
          </div>
        ))}
        <p className="text-xs text-white/40 mt-1">
          Dominant: <span className="text-white/70 capitalize">{balance.dominantModality}</span>
        </p>
      </div>
    </div>
  )
}

function PatternsTab({ patterns }: { patterns: string[] }) {
  return (
    <div className="space-y-2">
      {patterns.map((p, i) => (
        <div key={i} className="py-1 px-2 bg-white/5 rounded text-white/80 text-xs">
          {p}
        </div>
      ))}
      {patterns.length === 0 && (
        <p className="text-white/40 text-center">No chart patterns detected</p>
      )}
    </div>
  )
}

function LotsTab({ lots }: { lots: ReturnType<Chart['lots']> }) {
  return (
    <div className="space-y-1">
      {lots.map((l, i) => {
        const sign = signAtDegree(l.position.degrees)
        const degInSign = l.position.degrees - sign.startDegree
        return (
          <div key={i} className="flex items-center justify-between py-1 text-xs">
            <span className="text-white/90">{l.lot.name}</span>
            <span className="text-white/60">
              {degInSign.toFixed(1)}&deg; {SIGN_SYMBOLS[sign.index]}
            </span>
          </div>
        )
      })}
      {lots.length === 0 && (
        <p className="text-white/40 text-center">No lots available (need Ascendant)</p>
      )}
    </div>
  )
}
