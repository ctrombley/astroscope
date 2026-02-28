import { useState, useCallback, useMemo } from 'react'
import Orrery from './components/scene/Orrery'
import NightSky from './components/scene/NightSky'
import TimeControls from './components/ui/TimeControls'
import InfoPanel from './components/ui/InfoPanel'
import PlanetDetail from './components/ui/PlanetDetail'
import HarmonicPanel from './components/ui/HarmonicPanel'
import SettingsBar from './components/ui/SettingsBar'
import BirthChartModal from './components/ui/BirthChartModal'
import { useAnimation } from './hooks/useAnimation'
import { useChart } from './hooks/useChart'
import { usePositions } from './hooks/usePositions'
import { useHarmonics } from './hooks/useHarmonics'
import type { AppSettings, BirthChartData, ViewMode, Position3D, FlyTarget, SelectedAspect, SelectedPattern } from './types'

// Five-phase state machine for scene transitions.
// orrery ──fly-to-earth──► fade-to-sky ──► sky
//   ◄──────────────────── fade-to-orrery ◄──┘
type ScenePhase = 'orrery' | 'fly-to-earth' | 'fade-to-sky' | 'sky' | 'fade-to-orrery'

function loadStoredBirthChart(): BirthChartData | null {
  try {
    const stored = localStorage.getItem('astroscope-birth-chart')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return { ...parsed, date: new Date(parsed.date) }
  } catch { return null }
}

const _storedChart = loadStoredBirthChart()

export default function App() {
  const animation = useAnimation(_storedChart?.date)
  const { date } = animation

  const [settings, setSettings] = useState<AppSettings>({
    houseSystem: 'whole-sign',
    sidereal: false,
    showMinorAspects: false,
    showHarmonics: false,
    showAngles: true,
    latitude: _storedChart?.latitude ?? 40.7128,
    longitude: _storedChart?.longitude ?? -74.006,
  })

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<SelectedAspect | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<SelectedPattern | null>(null)
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(_storedChart)
  const [showBirthChartModal, setShowBirthChartModal] = useState(false)
  const [scenePhase, setScenePhase] = useState<ScenePhase>('orrery')
  const [showConstellations, setShowConstellations] = useState(true)
  const [showStarNames, setShowStarNames] = useState(false)

  // Derived from scenePhase
  const viewMode: ViewMode = (scenePhase === 'sky' || scenePhase === 'fade-to-sky') ? 'sky' : 'orrery'
  const skySettled = scenePhase === 'sky'
  // Orrery is invisible (fading out or fully out) when heading to or in sky mode
  const orreryFadedOut = scenePhase === 'fade-to-sky' || scenePhase === 'sky'
  // Sky is visible (fading in or fully in) when heading to or in sky mode
  const skyFadedIn = scenePhase === 'fade-to-sky' || scenePhase === 'sky'

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }))
  }, [])

  const handleApplyBirthChart = useCallback((data: BirthChartData) => {
    setBirthChart(data)
    localStorage.setItem('astroscope-birth-chart', JSON.stringify({ ...data, date: data.date.toISOString() }))
    animation.setDate(data.date)
    updateSettings({ latitude: data.latitude, longitude: data.longitude })
    setShowBirthChartModal(false)
  }, [animation, updateSettings])

  const handleClearBirthChart = useCallback(() => {
    setBirthChart(null)
    localStorage.removeItem('astroscope-birth-chart')
    setShowBirthChartModal(false)
  }, [])

  const chartData = useChart(
    date,
    settings.latitude,
    settings.longitude,
    settings.houseSystem,
    !settings.showMinorAspects,
  )
  const positions = usePositions(date)
  const harmonics = useHarmonics(chartData.chart)

  const selectedPlanetData = selectedPlanet
    ? positions.find(p => p.key === selectedPlanet)
    : null

  // Fly target for the orrery camera.
  const flyTarget = useMemo((): FlyTarget | null => {
    if (scenePhase === 'fly-to-earth') {
      const pos = positions.find(p => p.key === 'earth')?.position
      return pos ? { position: pos } : null
    }
    if (scenePhase !== 'orrery') return null
    if (selectedPlanet) {
      const pos = positions.find(p => p.key === selectedPlanet)?.position
      return pos ? { position: pos } : null
    }
    if (selectedAspect) {
      const p1 = positions.find(p => p.key === selectedAspect.body1Key)?.position
      const p2 = positions.find(p => p.key === selectedAspect.body2Key)?.position
      if (!p1 || !p2) return null
      const midpoint: Position3D = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, z: (p1.z + p2.z) / 2 }
      const sep = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)
      // Half-sep / tan(17.5°) ≈ half-sep * 3.2, with padding to 70% of the 50° FOV
      return { position: midpoint, distance: Math.max(4, sep * 1.6) }
    }
    if (selectedPattern) {
      const pts = selectedPattern.bodyKeys
        .map(k => positions.find(p => p.key === k)?.position)
        .filter((p): p is Position3D => p !== undefined)
      if (pts.length === 0) return null
      const centroid: Position3D = {
        x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
        y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
        z: pts.reduce((s, p) => s + p.z, 0) / pts.length,
      }
      const maxDist = Math.max(...pts.map(p =>
        Math.sqrt((p.x - centroid.x) ** 2 + (p.y - centroid.y) ** 2 + (p.z - centroid.z) ** 2)
      ))
      // maxDist / tan(17.5°) ≈ maxDist * 3.2, with padding to 70% of the 50° FOV
      return { position: centroid, distance: Math.max(4, maxDist * 3.5) }
    }
    return null
  }, [scenePhase, selectedPlanet, selectedAspect, selectedPattern, positions])

  const handleFlyComplete = useCallback(() => {
    if (scenePhase === 'fly-to-earth') {
      setSelectedPlanet(null)
      setSelectedAspect(null)
      setSelectedPattern(null)
      setScenePhase('fade-to-sky')
    }
  }, [scenePhase])

  const handleSetViewMode = useCallback((mode: ViewMode) => {
    if (mode === 'sky' && scenePhase === 'orrery') {
      setSelectedPlanet('earth')  // highlight Earth during fly
      const earthPos = positions.find(p => p.key === 'earth')?.position
      setScenePhase(earthPos ? 'fly-to-earth' : 'fade-to-sky')
    } else if (mode === 'orrery' && (scenePhase === 'sky' || scenePhase === 'fade-to-sky')) {
      setScenePhase('fade-to-orrery')
    }
  }, [scenePhase, positions])

  const handleSelectPlanet = useCallback((key: string | null) => {
    setSelectedPlanet(key)
    setSelectedAspect(null)
    setSelectedPattern(null)
  }, [])

  const handleSelectAspect = useCallback((aspect: SelectedAspect) => {
    setSelectedAspect(aspect)
    setSelectedPlanet(null)
    setSelectedPattern(null)
  }, [])

  const handleSelectPattern = useCallback((pattern: SelectedPattern) => {
    setSelectedPattern(pattern)
    setSelectedAspect(null)
    setSelectedPlanet(null)
  }, [])

  return (
    <div className="w-full h-full relative">
      {/* Orrery canvas — always mounted, fades out on sky transition */}
      <div
        className="absolute inset-0"
        style={{
          opacity: orreryFadedOut ? 0 : 1,
          transition: 'opacity 0.7s ease-in-out',
          pointerEvents: orreryFadedOut ? 'none' : 'auto',
        }}
        onTransitionEnd={(e) => {
          if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return
          if (scenePhase === 'fade-to-sky') setScenePhase('sky')
        }}
      >
        <Orrery
          positions={positions}
          chart={chartData.chart}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={handleSelectPlanet}
          selectedAspect={selectedAspect}
          onSelectAspect={handleSelectAspect}
          selectedPattern={selectedPattern}
          harmonicClusters={harmonics.clusters}
          showHarmonics={settings.showHarmonics}
          showAngles={settings.showAngles}
          flyTarget={flyTarget}
          onFlyComplete={handleFlyComplete}
        />
      </div>

      {/* NightSky canvas — always mounted, fades in on sky transition */}
      <div
        className="absolute inset-0"
        style={{
          opacity: skyFadedIn ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out',
          pointerEvents: scenePhase === 'sky' ? 'auto' : 'none',
        }}
        onTransitionEnd={(e) => {
          if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return
          if (scenePhase === 'fade-to-orrery') {
            setScenePhase('orrery')
            setSelectedPlanet(null)
            setSelectedAspect(null)
            setSelectedPattern(null)
          }
        }}
      >
        <NightSky
          positions={positions}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={handleSelectPlanet}
          showConstellations={showConstellations}
          showStarNames={showStarNames}
          date={date}
          longitude={settings.longitude}
        />
      </div>

      {/* UI Overlays */}
      <SettingsBar
        settings={settings}
        date={date}
        onUpdate={updateSettings}
        birthChart={birthChart}
        onOpenBirthChart={() => setShowBirthChartModal(true)}
        viewMode={viewMode}
        onSetViewMode={handleSetViewMode}
        showConstellations={showConstellations}
        onToggleConstellations={() => setShowConstellations(v => !v)}
        showStarNames={showStarNames}
        onToggleStarNames={() => setShowStarNames(v => !v)}
        skySettled={skySettled}
      />
      <TimeControls animation={animation} />
      <InfoPanel
        chart={chartData.chart}
        positions={positions}
        aspects={chartData.aspects}
        balance={chartData.balance}
        patterns={chartData.patterns}
        lots={chartData.lots}
        onSelectPlanet={handleSelectPlanet}
        onSelectAspect={handleSelectAspect}
        selectedAspect={selectedAspect}
        onSelectPattern={handleSelectPattern}
        selectedPattern={selectedPattern}
      />
      {selectedPlanetData && (
        <PlanetDetail
          planet={selectedPlanetData}
          date={date}
          onClose={() => setSelectedPlanet(null)}
        />
      )}
      <HarmonicPanel harmonics={harmonics} visible={settings.showHarmonics} />
      {showBirthChartModal && (
        <BirthChartModal
          current={birthChart}
          onApply={handleApplyBirthChart}
          onClear={handleClearBirthChart}
          onClose={() => setShowBirthChartModal(false)}
        />
      )}
    </div>
  )
}
