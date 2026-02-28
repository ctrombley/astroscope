import { useState } from 'react'
import {
  signAtDegree,
  SIGN_SYMBOLS,
  ELEMENTS,
  MODALITIES,
} from '@ctrombley/astrokit'
import type { Chart } from '@ctrombley/astrokit'
import { ELEMENT_COLORS, MODALITY_COLORS, ASPECT_COLORS, PLANET_COLORS } from '../../constants/colors'
import type { PlanetPosition, SelectedAspect, SelectedPattern } from '../../types'

type Tab = 'positions' | 'aspects' | 'balance' | 'patterns' | 'lots'

interface InfoPanelProps {
  chart: Chart
  positions: PlanetPosition[]
  aspects: ReturnType<Chart['aspects']>
  balance: ReturnType<Chart['balance']>
  patterns: string[]
  lots: ReturnType<Chart['lots']>
  onSelectPlanet?: (key: string) => void
  onSelectAspect?: (aspect: SelectedAspect) => void
  selectedAspect?: SelectedAspect | null
  onSelectPattern?: (pattern: SelectedPattern) => void
  selectedPattern?: SelectedPattern | null
}

export default function InfoPanel({
  chart,
  positions,
  aspects,
  balance,
  patterns,
  lots,
  onSelectPlanet,
  onSelectAspect,
  selectedAspect,
  onSelectPattern,
  selectedPattern,
}: InfoPanelProps) {
  const [tab, setTab] = useState<Tab>('positions')
  const [isOpen, setIsOpen] = useState(false)

  const symbolToKey = Object.fromEntries(positions.map(p => [p.symbol, p.key]))

  const tabs: { key: Tab; label: string }[] = [
    { key: 'positions', label: 'Planets' },
    { key: 'aspects', label: 'Aspects' },
    { key: 'balance', label: 'Balance' },
    { key: 'patterns', label: 'Patterns' },
    { key: 'lots', label: 'Lots' },
  ]

  return (
    <>
      {/* Mobile backdrop — closes drawer on outside tap */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={[
          // Mobile: fixed bottom drawer above TimeControls
          'fixed bottom-11 left-0 right-0 z-40',
          'max-h-[72vh]',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]',
          // Desktop: right sidebar (overrides all mobile positioning)
          'md:absolute md:top-0 md:right-0 md:bottom-auto md:left-auto',
          'md:w-72 md:h-full md:max-h-none md:translate-y-0 md:z-auto',
          // Shared styles
          'bg-black/80 backdrop-blur-sm',
          'border-t md:border-t-0 md:border-l border-white/10',
          'flex flex-col overflow-hidden',
        ].join(' ')}
      >
        {/* Mobile drag handle */}
        <div
          className="md:hidden flex justify-center items-center py-2 cursor-pointer shrink-0"
          onClick={() => setIsOpen(v => !v)}
        >
          <div className="w-8 h-0.5 rounded-full bg-white/30" />
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10 shrink-0">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => {
                if (tab === t.key && isOpen) {
                  setIsOpen(false)
                } else {
                  setTab(t.key)
                  setIsOpen(true)
                }
              }}
              className={`flex-1 px-2 py-2.5 md:py-2 text-xs tracking-wide transition-colors ${
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
          {tab === 'positions' && (
            <PositionsTab positions={positions} onSelectPlanet={onSelectPlanet} />
          )}
          {tab === 'aspects' && (
            <AspectsTab
              aspects={aspects}
              symbolToKey={symbolToKey}
              selectedAspect={selectedAspect ?? null}
              onSelectAspect={onSelectAspect}
            />
          )}
          {tab === 'balance' && <BalanceTab balance={balance} />}
          {tab === 'patterns' && (
            <PatternsTab
              patterns={patterns}
              symbolToKey={symbolToKey}
              selectedPattern={selectedPattern ?? null}
              onSelectPattern={onSelectPattern}
            />
          )}
          {tab === 'lots' && <LotsTab lots={lots} />}
        </div>
      </div>
    </>
  )
}

function PositionsTab({
  positions,
  onSelectPlanet,
}: {
  positions: PlanetPosition[]
  onSelectPlanet?: (key: string) => void
}) {
  return (
    <div className="space-y-0.5">
      {positions.map(p => {
        const sign = signAtDegree(p.longitudeDeg)
        const degInSign = p.longitudeDeg - sign.startDegree
        const color = PLANET_COLORS[p.key] ?? '#aaaaaa'
        return (
          <button
            key={p.key}
            onClick={() => onSelectPlanet?.(p.key)}
            className="w-full flex items-center justify-between py-2 md:py-1.5 px-2 rounded hover:bg-white/5 transition-colors text-left group"
          >
            <span
              className="font-medium group-hover:brightness-125 transition-all"
              style={{ color }}
            >
              {p.symbol} {p.name}
            </span>
            <span className="text-white/55 text-xs">
              {degInSign.toFixed(1)}&deg; {SIGN_SYMBOLS[sign.index]}
              {p.retrograde && <span className="text-[#9A4040] ml-1">Rx</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function AspectsTab({
  aspects,
  symbolToKey,
  selectedAspect,
  onSelectAspect,
}: {
  aspects: ReturnType<Chart['aspects']>
  symbolToKey: Record<string, string>
  selectedAspect: SelectedAspect | null
  onSelectAspect?: (aspect: SelectedAspect) => void
}) {
  return (
    <div className="space-y-0.5">
      {aspects.map((a, i) => {
        const body1Key = symbolToKey[a.body1.body.symbol] ?? a.body1.body.key
        const body2Key = symbolToKey[a.body2.body.symbol] ?? a.body2.body.key
        const isSelected =
          selectedAspect !== null &&
          selectedAspect.body1Key === body1Key &&
          selectedAspect.body2Key === body2Key &&
          selectedAspect.aspectName === a.aspect.name
        const aspectColor = ASPECT_COLORS[a.aspect.name]
        return (
          <button
            key={i}
            onClick={() => onSelectAspect?.({ body1Key, body2Key, aspectName: a.aspect.name })}
            className={`w-full flex items-center justify-between py-2 md:py-1.5 px-2 rounded transition-colors text-left text-xs ${
              isSelected ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <span className="text-white/90">
              {a.body1.body.symbol}{' '}
              <span style={{ color: aspectColor }}>{a.aspect.symbol}</span>{' '}
              {a.body2.body.symbol}
            </span>
            <span style={{ color: aspectColor }}>{a.aspect.name}</span>
            <span className="text-white/40">
              {a.orb.toFixed(1)}&deg; {a.applying ? 'a' : 's'}
            </span>
          </button>
        )
      })}
      {aspects.length === 0 && (
        <p className="text-white/40 text-center py-4">No aspects found</p>
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

function extractSymbolsFromPattern(pattern: string): string[] {
  const matches = pattern.match(/[\u2600-\u26FF\u2700-\u27BF\u{1F300}-\u{1F9FF}⊕]/gu) ?? []
  return matches
}

function PatternsTab({
  patterns,
  symbolToKey,
  selectedPattern,
  onSelectPattern,
}: {
  patterns: string[]
  symbolToKey: Record<string, string>
  selectedPattern: SelectedPattern | null
  onSelectPattern?: (pattern: SelectedPattern) => void
}) {
  return (
    <div className="space-y-2">
      {patterns.map((p, i) => {
        const bodyKeys = extractSymbolsFromPattern(p)
          .map(s => symbolToKey[s])
          .filter((k): k is string => k !== undefined)
        const isSelected = selectedPattern?.patternString === p
        return (
          <button
            key={i}
            onClick={() => bodyKeys.length > 0 && onSelectPattern?.({ patternString: p, bodyKeys })}
            className={`w-full py-2 md:py-1.5 px-2 rounded text-white/80 text-xs text-left transition-colors ${
              isSelected
                ? 'bg-white/10'
                : bodyKeys.length > 0
                  ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                  : 'bg-white/5 cursor-default'
            }`}
          >
            {p}
          </button>
        )
      })}
      {patterns.length === 0 && (
        <p className="text-white/40 text-center py-4">No chart patterns detected</p>
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
          <div key={i} className="flex items-center justify-between py-1.5 md:py-1 text-xs">
            <span className="text-white/90">{l.lot.name}</span>
            <span className="text-white/60">
              {degInSign.toFixed(1)}&deg; {SIGN_SYMBOLS[sign.index]}
            </span>
          </div>
        )
      })}
      {lots.length === 0 && (
        <p className="text-white/40 text-center py-4">No lots available (need Ascendant)</p>
      )}
    </div>
  )
}
