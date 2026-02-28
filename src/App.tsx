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
import type { AppSettings, BirthChartData, ViewMode, Position3D, SelectedAspect } from './types'

// Five-phase state machine for scene transitions.
// orrery ──fly-to-earth──► fade-to-sky ──► sky
//   ◄──────────────────── fade-to-orrery ◄──┘
type ScenePhase = 'orrery' | 'fly-to-earth' | 'fade-to-sky' | 'sky' | 'fade-to-orrery'

export default function App() {
  const animation = useAnimation()
  const { date } = animation

  const [settings, setSettings] = useState<AppSettings>({
    houseSystem: 'whole-sign',
    sidereal: false,
    showMinorAspects: false,
    showHarmonics: false,
    latitude: 40.7128,  // New York
    longitude: -74.006,
  })

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<SelectedAspect | null>(null)
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null)
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
    animation.setDate(data.date)
    updateSettings({ latitude: data.latitude, longitude: data.longitude })
    setShowBirthChartModal(false)
  }, [animation, updateSettings])

  const handleClearBirthChart = useCallback(() => {
    setBirthChart(null)
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
  const flyTarget = useMemo((): Position3D | null => {
    if (scenePhase === 'fly-to-earth') {
      return positions.find(p => p.key === 'earth')?.position ?? null
    }
    if (scenePhase === 'orrery' && selectedPlanet) {
      return positions.find(p => p.key === selectedPlanet)?.position ?? null
    }
    return null
  }, [scenePhase, selectedPlanet, positions])

  const handleFlyComplete = useCallback(() => {
    if (scenePhase === 'fly-to-earth') {
      setSelectedPlanet(null)
      setSelectedAspect(null)
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
    setSelectedAspect(null)  // clear aspect highlight when picking a planet
  }, [])

  const handleSelectAspect = useCallback((aspect: SelectedAspect) => {
    setSelectedAspect(aspect)
    setSelectedPlanet(null)  // clear planet selection when picking an aspect
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
          harmonicClusters={harmonics.clusters}
          showHarmonics={settings.showHarmonics}
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
